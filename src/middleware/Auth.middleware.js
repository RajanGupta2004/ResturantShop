import Vandor from "../models/vandor.model.js"
import { ApiResponse } from "../utility/ApiResponse.js"
import jwt from 'jsonwebtoken'



export const VerifyToken = async (req, res, next) => {

    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    // console.log("token", token)

    if (!token) {
        return res.status(401).json(new ApiResponse(401, "No token provided"))
    }

    try {

        // decode token

        const decodedToken =  jwt.verify(token, process.env.JWT_SECRET)

        // console.log("decodedToken", decodedToken)

        if (!decodedToken) {
            return res.status(401).json(new ApiResponse(401, "Invalid access token...."))
        }

        const vandor = await Vandor.findById(decodedToken?._id).select("-password")

        // console.log("vandor", vandor)

        if (!vandor) {
            return res.status(401).json(new ApiResponse(401, "Invalid access token...."))
        }

        req.user = vandor
        next()

    } catch (error) {
        console.log("Error in Auth Middleware", error)


    }
}