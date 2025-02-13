import Customer from "../models/customer.model.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { GenerateOTP, sendOTPOnRequest } from "../utility/notificationUtlity.js";
import { comparePassword, GeneratePassword, GenerateSignature } from "../utility/passwordUtility.js";
import jwt from 'jsonwebtoken'


export const customerSignUp = async (req, res) => {
    try {

        const { email, password, phone } = req.body;

        if (!email || !password || !phone) {
            return res.status(400).json(new ApiResponse(400, "All filed are required"))
        }

        // find user exist or not
        const customer = await Customer.findOne({ email: email })

        if (customer) {
            return res.status(400).json(new ApiResponse(400, "user already exist"))
        }

        // hashed password
        const salt = 10;
        const hashedPassword = await GeneratePassword(password, salt)

        // generate OTP
        const { otp, expiresAt } = GenerateOTP()
        console.log(otp, expiresAt)


        const user = await Customer.create({
            email: email,
            password: hashedPassword,
            phone,
            firstName: "",
            lastName: "",
            address: "",
            otp: otp,
            otp_expiry: expiresAt,
            verified: false,
            lat: 0,
            lng: 0,

        })

        if (!user) {
            return res.status(500).json(new ApiResponse(500, "something went wrong to create custome"))
        }

        // send OTP

        // await sendOTPOnRequest(otp, phone)

        // generate token 
        const payload = {
            _id:user._id,
            phone:user.phone,
            verified:user.verified
        }

        const {accessToken , refreshToken} = await GenerateSignature(payload)

        return res.status(200).json(new ApiResponse(201 , "user created" , {user , accessToken , refreshToken} , ))

    } catch (error) {
        console.log('Error in  customerSignUp ', error);
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}



export const customerLogin = async (req, res) => {
    try {

        const {email , password} = req.body

        if(!email || !password){
            return res.status(400).json(new ApiResponse(400 , "all filed are required..."))
        }

        // find user exist or not

        const customer = await Customer.findOne({email}).select("-refreshToken")

        if(!customer){
            return res.status(404).json(new ApiResponse(404 , "customer not found"))
        }


        // compare password

        const isPasswordCorrect = await comparePassword(password , customer.password)

        if(!isPasswordCorrect){
            return res.status(401).json(new ApiResponse(401 , "Invalid email and password..."))
        }


        // generate token
        const payload = {
            _id:customer._id,
            email:customer.email,
            verified:customer.verified
        }
        const { accessToken, refreshToken } = await GenerateSignature(payload)

        console.log(accessToken , refreshToken)

        customer.refreshToken = refreshToken

        customer.save()

        const options = {
            httpOnly:true,
            secure:true,
            sameSite: "Strict", // Helps prevent CSRF attacks,
            signed: true, // Prevents tampering
        }


        return res.status(200).cookie('accessToken', accessToken , options)
        .cookie('refreshToken', refreshToken , options)
        .json(new ApiResponse(200 , "Login successfull" , {customer , accessToken , refreshToken}))

    } catch (error) {
        console.log('Error in  customerSignUp ', error);
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}



export const refreshToken = async (req, res) => {
    try {
        const incommingRefreshToken = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

        if (!incommingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorised request"
            })
        }

        // verify token or decode

        const decodedToken = jwt.verify(incommingRefreshToken, process.env.JWT_SECRET)
        console.log("decodedToken", decodedToken)

        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid token "
            })
        }

        // find user based on decoded token 

        const user = await Customer.findById(decodedToken?._id)
        // console.log("user", user)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token.."
            })
        }


        // compare the both token incomming refreshToken and refreshToken store in DB

        if (incommingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is expired or used"
            })

        }

        // generate new access token

        const payload = {
            _id:user._id,
            email:user.email,
            verified:user.verified
        }
        const { accessToken, refreshToken } = await GenerateSignature(payload)

        // console.log("accessToken", accessToken)
        // console.log("refreshToken", refreshToken)

        const options = {
            httpOnly:true,
            secure:true,
            sameSite: "Strict", // Helps prevent CSRF attacks,
            signed: true, // Prevents tampering
        }

        return res.status(200)
        .cookie('accessToken', accessToken , options)
        .cookie('refreshToken', refreshToken , options)
        .json({
            success: true,
            message: "new accesToken generated successfull..."
        })

    } catch (error) {
        console.log("Refresh Token ERROR ", error)

    }
}


export const GetCustomerProfile = async (req , res)=>{
    try {
        const customer = req.user

        const customerProfile = await  Customer.findById(customer._id)
        if (!customerProfile) {
            return res.status(200).json(new ApiResponse(404 , "Customer Not found"))
        }

        return res.status(200).json(new ApiResponse(200 , "customer profile" , customerProfile));
        
    } catch (error) {
        console.log("Error in to get user profile" , error)
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}

export const EditCustomerProfile = async (req, res) => {
    try {
      const { firstName, lastName, address } = req.body;
  
      const customer = await Customer.findByIdAndUpdate(
        req.user._id,
        { firstName, lastName, address },
        { new: true, runValidators: true } // Ensures updated document is returned and validations are applied
      );
  
      if (!customer) {
        return res.status(404).json(new ApiResponse(404, "Customer not found"));
      }
  
      return res.status(200).json(new ApiResponse(200, "Profile updated successfully", customer));
    } catch (error) {
      console.error("Error in EditCustomerProfile", error);
      return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }
  };
  