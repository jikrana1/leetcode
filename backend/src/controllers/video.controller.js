import { v2 as cloudinary } from 'cloudinary';
import { problemModel } from '../models/problem.model.js';
import { videoModel } from '../models/video.model.js';
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name:"dmvx9rlyv",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
export const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    console.log(process.env.CLOUDINARY_API_SECRET);

    const userId = req.user._id;

    if (!problemId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing ID Field"
      })
    }
    const problem = await problemModel.findById(problemId);

    if (!problem) {
      return res.status(400).json({
        success: false,
        message: "problem not found"
      })
    }

    // Generate unique public_id for the video
    const timestamp = Math.round(new Date().getTime() / 1000);
    // console.log("timestamp : ", timestamp);
    const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`

    // upload parameters
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId
    };
    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );
    return res.status(200).json({
      message: "upload signature successfully",
      success: true,
      data: {
        signature,
        timestamp,
        public_id: publicId,
        cloud_name: "dmvx9rlyv",
        api_key: process.env.CLOUDINARY_API_KEY,
        upload_url: `https://api.cloudinary.com/v1_1/dmvx9rlyv/video/upload`,
      }
    }) 
  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({ error: 'Failed to generate upload credentials' });
  }
}

export const saveVideoMetadata = async (req, res) => {
  try {
    const {
      problemId,
      cloudinaryPublicId,
      secureUrl,
      duration,
    } = req.body;
    const userId = req.user._id;

    // first of all verify the upload with cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: 'video' }
    );
    if (!cloudinaryResource) {
      return res.status(400).json({ error: 'Video not found on Cloudinary' });
    }
    // Check if video already exists for this problem and user
    const existingVideo = await videoModel.findOne({
      problemId,
      userId,
      cloudinaryPublicId
    });
    if (existingVideo) {
      return res.status(409).json({ error: 'Video already exists' });
    }
    const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
      resource_type: 'image',
      transformation: [
        { width: 400, height: 225, crop: 'fill' },
        { quality: 'auto' },
        { start_offset: 'auto' }
      ],
      format: 'jpg'
    });

    // create video solution record 
    const SolutionVideo = await videoModel.create({
      problemId,
      userId,
      cloudinaryPublicId,
      secureUrl,
      duration: cloudinaryResource.duration || duration,
      thumbnailUrl
    })

    res.status(201).json({
      message: 'Video solution saved successfully',
      videoSolution: {
        id: SolutionVideo._id,
        thumbnailUrl: SolutionVideo.thumbnailUrl,
        duration: SolutionVideo.duration,
        uploadedAt: SolutionVideo.createdAt
      }
    });

  } catch (error) {
    console.error('Error saving video metadata:', error);
    res.status(500).json({ error: 'Failed to save video metadata' });

  }
}

export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!videoId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing ID Field"
      })
    }
    const video = await videoModel.findByIdAndDelete(videoId);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
      resource_type: "video", invalidate: true
    });

    return res.status(200).json({
      message: "video deleted successfully"
    })

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
}
