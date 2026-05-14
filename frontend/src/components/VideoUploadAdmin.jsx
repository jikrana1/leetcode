
import { useParams } from "react-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { axiosClient } from "../axios/axiosClient";
import { CloudSync } from 'lucide-react';

function VideoUploadAdmin() {
  
  const { problemId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm();

  const file = watch("video")?.[0];

  // 🎥 Preview Video
  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  }, [file]);

  // 🚀 Upload Logic
  const onSubmit = async (data, e) => {
    e.preventDefault();
    const file = data.video[0];
    console.log(file);
    setUploadedVideo(null);
    setUploading(true);
    setProgress(0);
    clearErrors();

    try {
      const res = await axiosClient.get(`/video/create/${problemId}`);

      const uploadData = res?.data?.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", uploadData?.signature);
      formData.append("timestamp", uploadData?.timestamp);
      formData.append("public_id", uploadData?.public_id);
      formData.append("api_key", uploadData?.api_key);

      const uploadRes = await axios.post(uploadData?.upload_url, formData, {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      const saved = await axiosClient.post("/video/save", {
        problemId,
        cloudinaryPublicId: uploadRes.data.public_id,
        secureUrl: uploadRes.data.secure_url,
        duration: uploadRes.data.duration,
      });
      console.log("SAVED : ", saved);

      setUploadedVideo(saved.data.videoSolution);
      reset();
      setVideoPreview(null);
    } catch (err) {
      console.log(err?.response);

      setError("root", {
        message: err.response?.data?.message || "Upload Failed",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-4 text-center text-primary flex justify-center items-center gap-1">
          <CloudSync /> Upload Solution Video
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Drag & Drop Box */}
          <label className="border-2 border-dashed border-gray-400 rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-gray-100">
            <span className="text-gray-500">Click or Drag Video Here</span>
            <input
              type="file"
              accept="video/*"
              hidden
              {...register("video", {
                required: "Video required",
              })}
            />
          </label>

          {/* Error */}
          {errors.video && (
            <p className="text-red-500 text-sm">{errors.video.message}</p>
          )}

          {/* Preview */}
          {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="w-full h-90 rounded-lg"
            />
          )}

          {/* Progress */}
          {uploading && (
            <div>
              <progress
                className="progress progress-primary w-full"
                value={progress}
                max="100"
              ></progress>
              <p className="text-sm text-center text-blue-700 " >{progress}%</p>
            </div>
          )}

          {/* Error */}
          {errors.root && (
            <div className="text-red-500 text-center">
              {errors.root.message}
            </div>
          )}

          {/* Success */}
          {uploadedVideo && (
            <div className="bg-green-100 text-green-700 p-3 rounded">
              ✅ Upload Successful
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={uploading}
            className="btn btn-primary w-full"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default VideoUploadAdmin;