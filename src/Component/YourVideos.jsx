import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const YourVideos = () => {

  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchVideos = async () => {

      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/videos/all?userOnly=true`,
          { credentials: "include" }
        );

        // user not logged in
        if (res.status === 401) {
          alert("Please login first");
          return;
        }

        const data = await res.json();

        if (data.success) {
          setVideos(data.videos);
        }

      } catch (error) {
        console.log(error);
      }

    };

    fetchVideos();

  }, []);

  return (

    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Your Videos
      </h1>

      {videos.length === 0 && (
        <p className="text-gray-500">
          You haven't uploaded any videos yet.
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

            <h3 className="mt-2 font-medium">
              {video.title}
            </h3>

            <p className="text-sm text-gray-500">
              {video.views} views
            </p>

          </div>

        ))}

      </div>

    </div>

  );

};

export default YourVideos;