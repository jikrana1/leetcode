import mongoose, { Schema } from "mongoose";

const problemSolvedSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  solvedCode: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'c++', 'java']
  },

}, { timestamps: true })
export const problemSolvedModel = mongoose.model("problemSolved" , problemSolvedSchema);