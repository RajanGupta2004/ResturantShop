import jwt from "jsonwebtoken";
import { ApiResponse } from "../utility/ApiResponse.js";

export const VerifyToken = async (req, res, next) => {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json(new ApiResponse(401, "No token provided"));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json(new ApiResponse(401, "Invalid access token."));
    }

    req.user = decodedToken; // Pass the decoded token to the next middleware
    next();
  } catch (error) {
    console.error("Token verification error", error);
    return res.status(500).json(new ApiResponse(500, "Invalid access token." , error.message));
  }
};
