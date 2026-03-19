import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PlaylistVideoPage = () => {

  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {

    const fetchPlaylist = async () => {

      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/playlists/getbyid/${playlistId}`,
          { credentials: "include" }
        );

        if (!res.ok) return;

        const data = await res.json();

        setPlaylist(data.playlist);

      } catch (error) {
        console.log(error);
      }

    };

    fetchPlaylist();

  }, [playlistId]);

  if (!playlist) return <div className="p-6">Loading...</div>;

  return (

    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        {playlist.name}
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {playlist.videos.map((video) => (

          <div
            key={video._id}
            onClick={() => navigate(`/watch/${video._id}`)}
            className="cursor-pointer"
          >

            <img
              src={video.thumbnail}
              alt="thumbnail"
              className="rounded-lg w-full"
            />

            <h3 className="mt-2 text-sm font-medium">
              {video.title}
            </h3>

          </div>

        ))}

      </div>

    </div>

  );

};

export default PlaylistVideoPage;