import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const SearchPage = () => {

  const [videos, setVideos] = useState([]);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = params.get("q");

  useEffect(() => {

    const fetchSearch = async () => {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/videos/search?query=${query}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setVideos(data.videos);

    };

    fetchSearch();

  }, [query]);

  return (

    <div className="p-6 max-w-5xl mx-auto">

      {videos.map((video) => (

        <div
          key={video._id}
          onClick={() => navigate(`/watch/${video._id}`)}
          className="flex gap-4 mb-6 cursor-pointer"
        >

          <img
            src={video.thumbnail}
            className="w-64 rounded-lg"
          />

          <div>

            <h3 className="font-semibold text-lg">
              {video.title}
            </h3>

            <p className="text-gray-400">
              {video.owner?.username}
            </p>

          </div>

        </div>

      ))}

    </div>

  );

};

export default SearchPage;