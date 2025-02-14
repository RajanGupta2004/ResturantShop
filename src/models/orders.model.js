


import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    orderID: { type: String, required: true },
    item: [
        {
            food: { type: mongoose.Schema.Types.ObjectId },
            unit: { type: Number, required: true }
        }
    ]
})


const Order = mongoose.model("order", orderSchema)

export default Order