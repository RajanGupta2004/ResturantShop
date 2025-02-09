import Vandor from "../models/vandor.model.js";
import { ApiResponse } from "../utility/ApiResponse.js"



export const GetFoodAvailibility = async (req, res) => {
    try {

        const pincode = req.params.pincode;

        const result = await Vandor.find({ pincode: pincode, serviceAvailable: true })
            .populate("foods").sort([['rating', "descending"]])

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

        const pincode = req.params.pincode;
        if (!pincode) {
            return res.status(404).json(new ApiResponse(400, "pincode required..."))
        }

        const result = await Vandor.find({ pincode: pincode, serviceAvailable: true }).populate("foods")

        if (result.length <= 0) {
            return res.status(404).json(new ApiResponse(404, "Resturant  not found"))
        }

        const AllfoodArr = []

        const foodIn30min = result.map((vandor) => (
            vandor.foods.filter((item) => item.readyTime <= 30)
        ))

        if(foodIn30min.length<=0){
            return res.status(404).json(new ApiResponse(404, "Resturant  not found"))
        }
        return res.status(200).json(new ApiResponse(200, "Food  in 30min data fetch successfully", foodIn30min))

    } catch (error) {
        console.log("Error in GetFoodIn30Min ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error "))

    }
}
export const GetSearchFood = async (req, res) => {
    try {

        const pincode = req.params.pincode;
        if (!pincode) {
            return res.status(404).json(new ApiResponse(400, "pincode required..."))
        }

        const result = await Vandor.find({ pincode: pincode, serviceAvailable: true }).populate("foods")


        const searchFood = result.map((vandor)=>vandor.foods)

        if(searchFood.length<0){
            return res.status(404).json(new ApiResponse(404 , "Food not found"))
        }

        return res.status(200).json(new ApiResponse(200, "Food  in 30min data fetch successfully", searchFood))


        if (result.length <= 0) {
            return res.status(404).json(new ApiResponse(404, "Resturant  not found"))
        }

    } catch (error) {
        console.log("Error in GetFoodAvailibility ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error "))

    }
}


export const ResturantById = async (req, res) => {
    try {

        const id = req.params.id

        const vandor = await Vandor.findById(id).populate("foods")

        if(!vandor){
            return res.status(404).json(new ApiResponse(404 , "Vandor not found..."))
        }
        return res.status(200).json(new ApiResponse(200, "Food  in 30min data fetch successfully", vandor))

        

    } catch (error) {
        console.log("Error in ResturantById ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error "))

    }
}