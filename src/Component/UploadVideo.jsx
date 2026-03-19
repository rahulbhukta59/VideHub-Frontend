import React, { useState } from "react";
import axios from "axios";

const UploadVideo = ({ closeModal, refreshVideos }) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleTextarea = (e) => {
    setDescription(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", video);

    try {

      setUploading(true);
      setProcessing(false);
      setProgress(0);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/videos/uploads`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setProgress(percent);

            if (percent === 100) {
              setUploading(false);
              setProcessing(true);
            }
          }
        }
      );

      setProcessing(false);

      alert("Video uploaded successfully 🎉");

      refreshVideos();
      closeModal();

    } catch (error) {

      console.error(error);
      alert("Upload failed");

      setUploading(false);
      setProcessing(false);

    } finally {
      setProgress(0);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[460px] relative">

      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl cursor-pointer hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition"
      >
        ✕
      </button>


      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Upload Video
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="text-sm text-gray-600 mb-1 block">  
          <b className="text-black text-md">Video Title</b>
          </label>

          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-400 px-4 py-2.5 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            focus:border-indigo-500 transition"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
          <b className="text-black text-md">Description</b>
          </label>

          <textarea
            placeholder="Tell viewers about your video..."
            value={description}
            onChange={handleTextarea}
            rows="3"
            className="
                w-full bg-gray-50 border border-gray-400 px-4 py-3 rounded-xl
                text-gray-700 placeholder-gray-400
                dark:bg-gray-900 dark:text-white dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                focus:bg-white dark:focus:bg-gray-900
                transition resize-none overflow-hidden max-h-[250px]
                "
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">  
          <b className="text-black text-md">Select Video</b>
          </label>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            required
            className="w-full text-sm border border-gray-300 rounded-lg
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-medium
            file:bg-indigo-600 file:text-white
            hover:file:bg-indigo-700 cursor-pointer"
          />
        </div>


        {uploading && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-sm text-center text-gray-600 mt-2">
              Uploading... {progress}%
            </p>
          </div>
        )}
        {processing && (
          <p className="text-sm text-center text-gray-500 mt-2 animate-pulse">
            Processing video... ⚙ Generating streams
          </p>
        )}
        <button
          type="submit"
          disabled={uploading || processing}
          className="w-full bg-indigo-600 hover:bg-indigo-700
          text-white py-2.5 rounded-lg font-medium
          transition cursor-pointer
          disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading
            ? "Uploading..."
            : processing
            ? "Processing..."
            : "Upload Video"}
        </button>

      </form>
    </div>
  );
};

export default UploadVideo;