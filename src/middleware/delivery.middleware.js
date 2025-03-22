import Delivery from "../models/delivery.model.js";

export const VerifyDeliveryUser = async (req, res, next) => {
  const profile = await Delivery.findById(req.user?._id).select("-password");

  if (!profile) {
    return res.status(401).json({ message: "Delivery user not found or unauthorized" });
  }

  req.user = profile;
  next();
};
