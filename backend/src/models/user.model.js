import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minLength: [3, "First name must be at least 3 characters"],
    maxLength: [20, "First name cannot exceed 20 characters"]
  },
  lastName: {
    type: String,
    minLength: [3, "Last name must be at least 3 characters"],
    maxLength: [20, "Last name cannot exceed 20 characters"]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters long'],
    select: false // Automatically exclude from queries
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

  },
  age: {
    type: Number,
    min: [10, 'Age must be at least 10'],
    max: [100, 'Age cannot exceed 100'],
    // required: [true, 'Age is required']
  },
  role: {
    type: String,
    required: [true, 'USer role is required'],
    enum: {
      values: ["user", "admin"],
      message: 'value is not a valid role'
    },
    default: 'user'
  },
  problemSolved: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Problem'
    }],
    unique: true
  }
}, { timestamps: true })

export const userModel = mongoose.model("User", userSchema);

// morgan