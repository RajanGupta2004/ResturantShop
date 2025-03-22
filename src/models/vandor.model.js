import mongoose from "mongoose";


const vandorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImage: { type: [String] },
    rating: { type: Number },
    foods: [{ type: mongoose.Schema.Types.ObjectId, ref: "food" }],
    lat: { type: Number },
    lng: { type: Number },

},{timestamps:true})


const Vandor = mongoose.model("vandor" , vandorSchema)

export default Vandor