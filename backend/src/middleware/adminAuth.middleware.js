import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { redisClient } from "../utils/redis.js";

export const isAdminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;


    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is not persent"
      })
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = payload;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid token"
      })
    }
    const user = await userModel.findById(_id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Doesn't Exist"
      })
    }

    if (payload.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin allowed"
      });
    }

    const IsBlocked = await redisClient.exists(`token:${token}`);

    if (IsBlocked) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token"
      })
    }
    req.user = user;
    next();

  } catch (error) {
    res.status(401).send("Error: " + err.message)

  }

}