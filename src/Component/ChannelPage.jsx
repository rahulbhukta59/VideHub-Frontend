import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ChannelPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await fetch(`${API}/api/v1/users/channel/${username}`, {
          credentials: "include",
        });

        const data = await res.json();

        const channelData = data.channel;

        setChannel(channelData);

        // fetch videos using channel id
        const videosRes = await fetch(
          `${API}/api/v1/videos/all?userId=${channelData._id}`,
          { credentials: "include" },
        );

        const videosData = await videosRes.json();

        setVideos(videosData.videos || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChannel();
  }, [username]);

  if (!channel) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8">
      {/* CHANNEL HEADER */}
      <div className="flex flex-col items-center justify-center mb-10">
        <img
          src={channel.profileimage}
          className="w-24 h-24 rounded-full object-cover mb-3"
        />

        <h1 className="text-2xl font-semibold text-center">
          {channel.username}
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Videos
        </p>
      </div>

      {/* CHANNEL VIDEOS */}

      <div className="grid grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            onClick={() => navigate(`/watch/${video._id}`)}
            className="cursor-pointer"
          >
            <img src={video.thumbnail} className="rounded-lg" />

            <p className="mt-2 font-medium">{video.title}</p>

            <p className="text-sm text-gray-500">{video.views} views</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelPage;
