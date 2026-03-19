import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [videos, setVideos] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/watchHistory`,
          { credentials: "include" }
        );

        if (res.status === 401) {
          alert("Please login to see your history");
          navigate("/");
          return;
        }

        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleDelete = async (videoId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/removeFromHistory/${videoId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) return;

      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      setOpenMenuId(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="px-10 py-6">
      <h1 className="text-2xl font-semibold mb-6">
        Watch History
      </h1>

      {videos.length === 0 && (
        <p className="text-gray-500">
          No watched videos yet
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="relative cursor-pointer group"
            onClick={() => navigate(`/watch/${video._id}`)}
          >
            {/* 🎯 3 DOT BUTTON (FIXED VISIBILITY) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(
                  openMenuId === video._id ? null : video._id
                );
              }}
              className="
                absolute bottom-2 right-2 z-20
                flex items-center justify-center
                w-9 h-9
                rounded-full
                bg-black/80 text-white
                hover:bg-gray-500/80
                shadow-md
                opacity-100
                cursor-pointer
              "
            >
              ⋮
            </button>

            {/* 🎯 DROPDOWN */}
            {openMenuId === video._id && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="
                  absolute bottom-12 right-2 z-30
                  bg-white dark:bg-gray-800
                  shadow-xl rounded-lg p-2 w-44
                  border border-gray-200 dark:border-gray-700
                "
              >
                <button
                  onClick={() => handleDelete(video._id)}
                  className="
                    w-full text-left px-3 py-2 text-sm rounded
                    text-gray-800 dark:text-white
                    hover:bg-gray-100 dark:hover:bg-gray-700
                  "
                >
                  Remove from history
                </button>
              </div>
            )}
            
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full rounded-lg"
            />

            {/* Info */}
            <h3 className="mt-2 font-medium">
              {video.title}
            </h3>

            <p className="text-sm text-gray-500">
              {video.owner?.username}
            </p>

            <p className="text-sm text-gray-400">
              {video.views} views
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;