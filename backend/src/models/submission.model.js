import mongoose, { Schema } from "mongoose";

const submissionSchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'c++', 'java']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong', 'error'],
    default: 'pending'
  },
  runtime: {
    type: Number,  // milliseconds
    default: 0
  },
  memory: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: ""
  },
  testCasePassed: {
    type: Number,
    default: 0
  },
  testCasesTotal: {
    type: Number,
    default: 0
  }

}, { timestamps: true })

export const submissionModel = mongoose.model("submission",submissionSchema);