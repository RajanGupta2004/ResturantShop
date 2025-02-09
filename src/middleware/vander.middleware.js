import Vandor from "../models/vandor.model.js";

export const VerifyVendor = async (req, res, next) => {
  const user = await Vandor.findById(req.user?._id).select("-password");

  if (!user) {
    return res.status(401).json({ message: "Vendor not found or unauthorized" });
  }

  req.user = user;
  next();
};
