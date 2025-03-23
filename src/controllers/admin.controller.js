import Delivery from "../models/delivery.model.js"
import Vandor from "../models/vandor.model.js"
import { ApiResponse } from "../utility/ApiResponse.js"
import { GeneratePassword } from "../utility/passwordUtility.js"



export const createVendor = async (req, res) => {

    try {

        const { name, address, pincode, foodType, email, password, ownerName, phone } = req.body

        if (!name || !address || !pincode || !email || !password || !ownerName || !phone) {
            return res.status(400).json(new ApiResponse(400, "All field required..."))
        }

        const existingVendor = await Vandor.findOne({ email: email })

        if (existingVendor) {
            return res.status(400).json(new ApiResponse(400, "vendor is already exist"))
        }


        // hashed password

        const salt = 10

        const hashedPassword = await GeneratePassword(password , salt)

       const createdVendor =  await Vandor.create({
            name,
            address,
            pincode,
            foodType,
            email,
            password:hashedPassword,
            ownerName,
            phone

        })

        return res.status(201).json(new ApiResponse(201 , "vendor created successfully" , createdVendor))

    } catch (error) {
        console.log("Error in creating vendor", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}


export const getVendors = async (req, res) => {
    try {

        const vandor = await Vandor.find()

        if(!vandor){
            return res.status(404).json(new ApiResponse(404 , "Vandors not found..."))
        }

        return res.status(200).json(new ApiResponse(200 , "List of All vendors" , vandor))

    } catch (error) {
        console.log("Error in get vendor", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}



export const getVendorById = async (req, res) => {
    try {

        const vandorId = req.params.id;

        const vandorById = await Vandor.findById(vandorId);
        if(!vandorById){
            return res.status(404).json(new ApiResponse(404 , "Vandor not found"))
        }

        return res.status(200).json(new ApiResponse(200 , "vandor data found..." , vandorById))

    } catch (error) {
        console.log("Error in getVendor By Id vendor", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}


export const VerifyDeliveryUserByAdmin = async( req , res)=>{
    try {

        const {_id , status} = req.body;

        if (!_id || typeof status !== "boolean") {
            return res.status(400).json(new ApiResponse(400, "Invalid request data"));
        }

        const deliveryUserProfile = await Delivery.findById(_id);

        if(!deliveryUserProfile){
            return res.status(404).json(new ApiResponse(404 , "Delivery not found"))
        }

        deliveryUserProfile.verified = status;

        await deliveryUserProfile.save();
        
        return res.status(200).json(new ApiResponse(200, "Delivery user verification updated", deliveryUserProfile));
        
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}




export const GetDeliveryUser = async( req , res)=>{
    try {

        const deliveryUserProfile = await Delivery.find();

        if(!deliveryUserProfile){
            return res.status(404).json(new ApiResponse(404 , "Delivery not found"))
        }


        return res.status(200).json(new ApiResponse(200, "Delivery users", deliveryUserProfile));
        
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}