import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/videos/all`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok && data.videos) {
          setVideos(data.videos);
        } else {
          console.error(data.message || "Failed to fetch videos");
        }
      } catch (error) {
        console.log("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading videos...
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No videos found
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(270px,1fr))]">

          {videos.map((video) => (
            <div
              key={video._id}
              onClick={() => navigate(`/watch/${video._id}`)}
              className="cursor-pointer group transition duration-300 hover:-translate-y-1"
            >

              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/480x270?text=Video+Thumbnail";
                  }}
                />

                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {Math.floor(video.duration / 60)}:
                  {(video.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>

              {/* Info */}
              <div className="flex gap-5 mt-3">
                <img
                  src={video.owner?.profileimage || "/default-avatar.png"}
                  alt="channel"
                  className="w-9 h-9 rounded-full"
                />

                <div>
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-500 transition">
                    {video.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {video.owner?.username || "Unknown Channel"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {video.views || 0} views
                  </p>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Video;
