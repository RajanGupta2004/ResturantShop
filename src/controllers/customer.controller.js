import Customer from "../models/customer.model.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { GenerateOTP, sendOTPOnRequest } from "../utility/notificationUtlity.js";
import { comparePassword, GeneratePassword, GenerateSignature } from "../utility/passwordUtility.js";


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

        const token = await GenerateSignature(payload)

        return res.status(200).json(new ApiResponse(201 , "user created" , {user , token} , ))

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

        const customer = await Customer.findOne({email})

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
        const token = await GenerateSignature(payload)


        return res.status(200).json(new ApiResponse(200 , "Login successfull" , {customer , token}))

    } catch (error) {
        console.log('Error in  customerSignUp ', error);
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
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
  