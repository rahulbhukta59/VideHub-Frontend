import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LikedVideos = () => {

  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchLikedVideos = async () => {

      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/likes/likedvideos`,
          { credentials: "include" }
        );

        // user not logged in
         if (res.status === 401) {
      alert("Please login get liked videos");
      return;
        }

        const data = await res.json();

        if (!data.likedvideos || data.likedvideos.length === 0) {
          setVideos([]);
          return;
        }

        // fetch video details
        const videoRequests = data.likedvideos.map(async (like) => {

          const videoRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/videos/${like.video}`,
            { credentials: "include" }
          );

          const videoData = await videoRes.json();

          return videoData.video;

        });

        const videosData = await Promise.all(videoRequests);

        setVideos(videosData);

      } catch (error) {
        console.log(error);
      }

    };

    fetchLikedVideos();

  }, []);

  return (

    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Liked Videos
      </h1>

      {videos.length === 0 && (
        <p className="text-gray-500">
          No liked videos yet
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {videos.map(video => (

          <div
            key={video._id}
            onClick={() => navigate(`/watch/${video._id}`)}
            className="cursor-pointer"
          >

            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full rounded-lg"
            />

            <h3 className="mt-2 font-medium line-clamp-2">
              {video.title}
            </h3>

            <p className="text-sm text-gray-500">
              {video.owner?.username}
            </p>

            <p className="text-xs text-gray-400">
              {video.views} views
            </p>

          </div>

        ))}

      </div>

    </div>

  );
};

export default LikedVideos;