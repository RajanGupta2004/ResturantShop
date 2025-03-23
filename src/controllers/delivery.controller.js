import Customer from "../models/customer.model.js";
import Delivery from "../models/delivery.model.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { GenerateOTP } from "../utility/notificationUtlity.js";
import { comparePassword, GeneratePassword, GenerateSignature } from "../utility/passwordUtility.js";
import jwt from 'jsonwebtoken'


export const deliverySignUp = async (req, res) => {
    try {

        const { email, password, phone, address, firstName, lastName, pincode } = req.body;

        if (!email || !password || !phone || !address || !firstName || !lastName || !pincode ) {
            return res.status(400).json(new ApiResponse(400, "All filed are required"))
        }

        // find user exist or not
        const customer = await Delivery.findOne({ email: email })

        if (customer) {
            return res.status(400).json(new ApiResponse(400, "Delivery person already exist"))
        }

        // hashed password
        const salt = 10;
        const hashedPassword = await GeneratePassword(password, salt)

        // generate OTP
        const { otp, expiresAt } = GenerateOTP()
        console.log(otp, expiresAt)


        const delivery = await Delivery.create({
            email: email,
            password: hashedPassword,
            phone,
            firstName,
            lastName,
            address,
            pincode,
            otp_expiry: expiresAt,
            verified: false,
            lat: 0,
            lng: 0,

        })

        if (!delivery) {
            return res.status(500).json(new ApiResponse(500, "something went wrong to create delivery"))
        }

        // send OTP

        // await sendOTPOnRequest(otp, phone)

        // generate token 
        const payload = {
            _id: delivery._id,
            phone: delivery.phone,
            verified: delivery.verified
        }

        const { accessToken, refreshToken } = await GenerateSignature(payload)

        return res.status(200).json(new ApiResponse(201, "user created", { delivery, accessToken, refreshToken },))

    } catch (error) {
        console.log('Error in  customerSignUp ', error);
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}



export const deliveryLogin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json(new ApiResponse(400, "all filed are required..."))
        }

        // find user exist or not

        const delivery = await Delivery.findOne({ email }).select("-refreshToken")

        if (!delivery) {
            return res.status(404).json(new ApiResponse(404, "delivery person not found"))
        }


        // compare password

        const isPasswordCorrect = await comparePassword(password, delivery.password)

        if (!isPasswordCorrect) {
            return res.status(401).json(new ApiResponse(401, "Invalid email and password..."))
        }


        // generate token
        const payload = {
            _id: delivery._id,
            email: delivery.email,
            verified: delivery.verified
        }
        const { accessToken, refreshToken } = await GenerateSignature(payload)

        // console.log(accessToken, refreshToken)

        delivery.refreshToken = refreshToken

        delivery.save()

        const options = {
            // httpOnly: true,
            // secure: true,
            // sameSite: "Strict", // Helps prevent CSRF attacks,
            // signed: true, // Prevents tampering
        }


        return res.status(200).cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(new ApiResponse(200, "Login successfull", { delivery, accessToken, refreshToken }))

    } catch (error) {
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

        const user = await Delivery.findById(decodedToken?._id)
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
            _id: user._id,
            email: user.email,
            verified: user.verified
        }
        const { accessToken, refreshToken } = await GenerateSignature(payload)

        // console.log("accessToken", accessToken)
        // console.log("refreshToken", refreshToken)

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "Strict", // Helps prevent CSRF attacks,
            signed: true, // Prevents tampering
        }

        return res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                success: true,
                message: "new accesToken generated successfull..."
            })

    } catch (error) {
        console.log("Refresh Token ERROR ", error)

    }
}



export const UpdateDeliveryUserStatus = async (req , res)=>{
    try {

        const deliveryUser = req.user;

        const {lat , lng} = req.body;


        const existingDeliveryUser = await Delivery.findById(deliveryUser._id);

        if(!existingDeliveryUser){
            return res.status(200).json(new ApiResponse(404, "deliveryUser Not found"))
        }

        existingDeliveryUser.isAvailable = !existingDeliveryUser.isAvailable

        if(lat && lng){
            existingDeliveryUser.lat = lat,
            existingDeliveryUser.lng=lng
        }

        await existingDeliveryUser.save()

        return res.status(200).json(new ApiResponse(200, "deliver user service active"));

        
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}


export const GetDeliverUserProfile = async (req, res) => {
    try {
        const profile = req.user

        const deliverUserProfile = await Delivery.findById(profile._id)
        if (!deliverUserProfile) {
            return res.status(200).json(new ApiResponse(404, "Delivery Not found"))
        }

        return res.status(200).json(new ApiResponse(200, "deliverUser profile", deliverUserProfile));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}

export const EditDeliveryUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, address } = req.body;

        const profile = await Delivery.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, address },
            { new: true, runValidators: true } // Ensures updated document is returned and validations are applied
        );

        if (!profile) {
            return res.status(404).json(new ApiResponse(404, "Delivery user not found"));
        }

        return res.status(200).json(new ApiResponse(200, "Profile updated successfully", profile));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }
};