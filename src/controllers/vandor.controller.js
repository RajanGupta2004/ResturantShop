import Food from "../models/food.model.js"
import Order from "../models/orders.model.js"
import Vandor from "../models/vandor.model.js"
import { ApiResponse } from "../utility/ApiResponse.js"
import { comparePassword, GenerateSignature } from "../utility/passwordUtility.js"



export const VandorLogin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json(new ApiResponse("All field are required...."))
        }

        const existingVandor = await Vandor.findOne({ email: email })

        if (!existingVandor) {
            return res.status(404).json(new ApiResponse(404, "Vandor nor exist...."))
        }

        // compare password

        const isPasswordCorrect = await comparePassword(password, existingVandor.password)

        // console.log("isPassword correct"  , isPasswordCorrect)

        if (!isPasswordCorrect) {
            return res.status(401).json(new ApiResponse(401, "Invalid password"))
        }

        // generate token

        const token = await GenerateSignature({ _id: existingVandor._id, email: existingVandor.email })


        return res.status(200).json(new ApiResponse(200, "Login Successfull...", { existingVandor, token }))

    } catch (error) {
        console.log("Errro in Vendor login", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}


export const GetVandorProfile = async (req, res) => {
    try {

        return res.status(200).json(new ApiResponse(200, "Vandor profile fetch successfully", req.user))



    } catch (error) {
        console.log("Errro in GetVandorProfile ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}



export const UpdateVandorProfile = async (req, res) => {
    try {

        const { name, address, phone, foodType } = req.body;

        if (!name || !address || !phone || !foodType) {
            return res.status(400).json(new ApiResponse(400, "All fields are required..."))
        }

        const user = req.user;


        const existingVandor = await Vandor.findById(user._id).select("-password");

        if (!existingVandor) {
            return res.status(404).json(new ApiResponse(404, "Vandor not found"))
        }

        existingVandor.name = name,
            existingVandor.address = address,
            existingVandor.phone = phone,
            existingVandor.foodType = foodType

        // save update data 

        existingVandor.save()

        return res.status(200).json(new ApiResponse(200, "Vandor data update successfully...", existingVandor))


    } catch (error) {
        console.log("Errro in UpdateVandorProfile ", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}



export const UpdateVandorService = async (req, res) => {
    try {

        const user = req.user;


        const existingVandor = await Vandor.findById(user._id)


        if(!existingVandor){
            return res.status(404).json(new ApiResponse(404 , "user Not found"))
        }

        existingVandor.serviceAvailable = !existingVandor.serviceAvailable

        // save changes

        existingVandor.save();

        return res.status(200).json(new ApiResponse(200 , "service updated successfully" , existingVandor))

    } catch (error) {
        console.log("Errro in Vendor login", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}




export const Addfood = async (req , res)=>{
    try {
        const {name , description , category , foodType ,readyTime ,rating,price} = req.body

        if(!name || !description  || !category || !foodType || !readyTime || !rating || !price){
            return res.status(400).json(new ApiResponse(400 , "All field are required"))
        }

        const user = req.user

        const existingVandor = await Vandor.findById(user._id).select("-password")

        if(!existingVandor){
            return res.status(404).json(new ApiResponse(404 , "Vandor not found..."))
        }


        const createdFood = await Food.create({
            vandorId:existingVandor._id,
            name,
            description,
            category,
            foodType,
            readyTime,
            rating,
            price
        })

         existingVandor.foods.push(createdFood)
         existingVandor.save()


         return res.status(200).json(new ApiResponse(200 , "Food item created successfully" , existingVandor))
        
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}



export const Getfood = async (req , res)=>{
    try {

        const user = req.user

        const vandor = await Vandor.findById(user._id).select("-password")

        if(!vandor){
            return res.status(404).json(new ApiResponse(404 , "Vandor not found...."))
        }

        const foods = await Food.find({vandorId:vandor._id})

        if(!foods){
            return res.status(404).json(new ApiResponse(404 , "List of food not found..."))
        }

        return res.status(200).json(new ApiResponse(200 , "Foods data fetch successfully..." , foods))
        
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}







export const GetCurrentOrder = async (req , res)=>{
    try {

        const user = req.user;

        const orders = await Order.find({vandorId:user._id}).populate("items.food");

        if(!orders){
            return res.status(404).json(new ApiResponse(402 , "Order not found"))
        }

        return res.status(200).json(new ApiResponse(200 , "Data fetch Successfully" , orders))
        
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}




export const GetOrderDetails = async (req , res)=>{
    try {

        const orderID = req.params.id;

        const order = await Order.find({orderID}).populate("items.food");

        if(!order){
            return res.status(404).json(new ApiResponse(402 , "Order not found"))
        }

        return res.status(200).json(new ApiResponse(200 , "order Details" , order));
        
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}



export const ProcessOrder = async (req, res) => {
    try {
        const orderID = req.params.id;
        const { status, remark, readyTime } = req.body;

        const order = await Order.findOne({ orderID }).populate("items.food");

        if (!order) {
            return res.status(404).json(new ApiResponse(404, "Order not found"));
        }

        order.orderStatus = status || order.orderStatus;
        order.readyTime = readyTime || order.readyTime;
        order.remarks = remark || order.remarks;

        await order.save();

        return res.status(200).json(new ApiResponse(200, "Order processed successfully", order));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }
};





// export const Addfood = async (req , res)=>{
//     try {
        
//     } catch (error) {
//         console.log('Error to add food' , error);
//         return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
//     }
// }


