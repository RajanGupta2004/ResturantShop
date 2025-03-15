
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: true },
    vandorId: { type: mongoose.Schema.Types.ObjectId, ref: "vandor", required: true },
    orderID: { type: String, required: true, unique: true },
    items: [
        {
            food: { type: mongoose.Schema.Types.ObjectId, ref: "food", required: true },
            unit: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true }, // New field to store total price
    // paidAmount: { type: Number, required: true },
    paidTrough:{type:String  },
    paymentResponse:{type:String},
    orderDate: { type: Date },
    orderStatus: { type: String, enum: ["pending", "confirmed", "delivered"], default: "pending" }, // New field
    remarks: { type: String },
    deliveryId: { type: String },
    readyTime: { type: Number },
    appliedOffers:{type:Boolean},
    offerId:{type:String},
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Order = mongoose.model("order", orderSchema);

export default Order;



// import mongoose from "mongoose";


// const orderSchema = new mongoose.Schema({
//     orderID: { type: String, required: true },
//     item: [
//         {
//             food: { type: mongoose.Schema.Types.ObjectId },
//             unit: { type: Number, required: true }
//         }
//     ]
// })


// const Order = mongoose.model("order", orderSchema)

// export default Order