import mongoose from "mongoose";


const foodSchema = new mongoose.Schema({

    vandorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number },
    rating: { type: Number },
    images: { type: [String] },

})

const Food = mongoose.model("food", foodSchema)

export default Food