import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    offerType: { type: String }, // Type of offer (e.g., "GENERIC", "ALL")
    title: { type: String, required: true }, // Offer title
    description: { type: String }, // Offer description
    minValue: { type: Number, default: 0 }, // Minimum order value required
    discountType: { type: String, enum: ["flat", "percentage"], required: true }, // Discount type: flat or percentage
    discountValue: { type: Number, required: true }, // Discount amount or percentage
    offerAmount: { type: Number, default: 0 }, // Amount discount (if applicable)
    startValidity: { type: Date, required: true }, // Offer start date
    endValidity: { type: Date, required: true }, // Offer end date
    promocode: { type: String, required: true, unique: true }, // Offer code (e.g., "DISCOUNT10")
    isActive: { type: Boolean, default: true }, // Offer status
    bank: { type: String }, // Applicable bank name (if any)
    bins: [{ type: String }], // Array of applicable bank BINs (Bank Identification Numbers)
    pincode: { type: String } ,// Pincode restriction (if applicable)
    applicableVendor: { type: mongoose.Schema.Types.ObjectId, ref: "vandor" }, // Vendor-specific offer

}, { timestamps: true });

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
