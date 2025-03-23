import mongoose from "mongoose";


const deliverySchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, },
    lastName: { type: String },
    address: { type: String },
    // verified: { type: Boolean, required: true },
    phone: { type: String, required: true },
    verified:{type:Boolean , default:"false"},
    lat: { type: Number },
    lng: { type: Number },
    pincode:{type:Number},
    isAvailable:{type:Boolean , default:false}
   

}, { timestamps: true })


const Delivery = mongoose.model("delivery", deliverySchema)

export default Delivery