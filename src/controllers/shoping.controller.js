import Vandor from "../models/vandor.model.js";
import { ApiResponse } from "../utility/ApiResponse.js"



export const GetFoodAvailibility = async (req, res) => {
    try {

        const pincode = req.params.pincode;

        const result = await Vandor.find({ pincode: pincode, serviceAvailable: true })
        .populate("foods").sort([['rating' , "descending"]])

        if (result.length < 0) {
            return res.status(404).json(new ApiResponse(404, "Food not found"))
        }

        return res.status(200).json(new ApiResponse(200, "Food fetch successfully", result))

    } catch (error) {
        console.log("Error in GetFoodAvailibility ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error "))

    }
}




export const GetTopResturant = async (req, res) => {
    try {
        
        const pincode = req.params.pincode;
        console.log(pincode)

        const result = await Vandor.find({ pincode: pincode, serviceAvailable: true })
       

        if (result.length <= 0) {
            return res.status(404).json(new ApiResponse(404, "Resturant  not found"))
        }

        return res.status(200).json(new ApiResponse(200, "Food TopResturant successfully", result))

    } catch (error) {
        console.log("Error in GetTopResturant ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error "))

    }
}
export const GetFoodIn30Min = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error in GetFoodIn30Min ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error "))

    }
}
export const GetSearchFood = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error in GetFoodAvailibility ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error "))

    }
}
export const ResturantById = async (req, res) => {
    try {

    } catch (error) {
        console.log("Error in ResturantById ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error "))

    }
}