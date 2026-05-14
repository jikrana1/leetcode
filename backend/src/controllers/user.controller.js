
import bcrypt from "bcrypt";
import { userModel } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { redisClient } from "../utils/redis.js";
import { ValidaterFunc } from "../utils/validaterFunc.js";

export const userRegister = async (req,res) => {
  try {    
    const { firstName, email, password } = req.body;
    if (!firstName || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All filed required"
      });
    }
    const validate = ValidaterFunc(req.body);

    const errorMessage = validate
      .filter(({ check }) => !check())
      .map(({ message }) => message);

    if (errorMessage.length > 0) {
      return res.status(400).json({ success: false, errors: errorMessage });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }
    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // create user
    req.body.password = hashPassword;
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
      role: "user"
    });

    // token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );


    // cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000
    })
    res.status(201).json({
      success: true,
      message: "USer Registered Successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role:user.role
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
      })
    }
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User dosn't exists"
      })
    }

    const IsPasswordMatched = await bcrypt.compare(password, user.password);

    if (!IsPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
      })
    }
    // token
    const token = jwt.sign(
      { _id: user._id,role:user.role },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    // cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000
    })
    res.status(200).json({
      success: true,
      message: "User Logged  Successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      }
    })

  } catch (error) {
    res.status(401).send("Error: " + error);
  }
}

export const userLoggout = async (req, res) => {
  try {

    const { token } = req.cookies;
    const payload = jwt.decode(token);

    await redisClient.set(`token:${token}`, 'Blocked');
    await redisClient.expireAt(`token:${token}`, payload.exp);
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logged Out Successfully"
    })
  } catch (error) {
    res.status(503).send("Error: " + error);
  }
}

export const adminRegister = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;


    if (!firstName || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All filed required"
      });
    }


    const hashPassword = await bcrypt.hash(password, 10);


    // create user
    req.body.password = hashPassword;
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
      role: "admin",
    });

    // token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );


    // cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000
    })
    res.status(201).json({
      success: true,
      message: "User Registered Successfully"
    })

  } catch (error) {
    res.status(400).send("Error: " + error);

  }
}
export const isCheckLogin = async (req, res) => {
  try {
    const user = {
      name: req.user.firstName || req.user.name,
      email: req.user.email,
      _id: req.user._id,
      role:req.user.role
    }
    res.status(200).json({
      user,
      message: "Valid USer",
      success: true
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error,
      message: "Invalid user"
    })
  }
}