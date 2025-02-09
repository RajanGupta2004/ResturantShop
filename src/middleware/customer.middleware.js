import Customer from "../models/customer.model.js";

export const VerifyCustomer = async (req, res, next) => {
  const user = await Customer.findById(req.user?._id).select("-password");

  if (!user) {
    return res.status(401).json({ message: "Customer not found or unauthorized" });
  }

  req.user = user;
  next();
};
