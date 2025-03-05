import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, },
    lastName: { type: String },
    address: { type: String },
    verified: { type: Boolean, required: true },
    phone: { type: String, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    refreshToken: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    cart: [{
        food: { type: mongoose.Schema.Types.ObjectId, ref: "food" },
        unit:{type:Number , required:true}
    }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }]

}, { timestamps: true })


const Customer = mongoose.model("customer", customerSchema)

export default Customer