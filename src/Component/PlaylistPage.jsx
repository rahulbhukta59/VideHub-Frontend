// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const PlaylistPage = () => {
//   const [playlists, setPlaylists] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPlaylists = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_API_URL}/api/v1/playlists/get/${localStorage.getItem("userId")}`,
//           { credentials: "include" },
//         );

//         if (!res.ok) return;

//         const data = await res.json();

//         setPlaylists(data.playlists);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchPlaylists();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-6">Your Playlists</h1>

//       <div className="grid grid-cols-3 gap-6">
//         {playlists.map((playlist) => (
//           <div
//             key={playlist._id}
//             onClick={() => navigate(`/playlist/${playlist._id}`)}
//             className="cursor-pointer"
//           >
//             {/* Thumbnail */}
//             <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
//               {playlist.videos && playlist.videos.length > 0 ? (
//                 <img
//                   src={playlist.videos[0].thumbnail}
//                   alt="playlist thumbnail"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
//                   No videos
//                 </div>
//               )}

//               {/* Video count badge */}
//               <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                 {playlist.videos.length} videos
//               </div>
//             </div>

//             {/* Playlist title */}
//             <h3 className="mt-2 text-sm font-medium">{playlist.name}</h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PlaylistPage;













import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/playlists/get/${localStorage.getItem("userId")}`,
          { credentials: "include" }
        );

        if (!res.ok) return;

        const data = await res.json();
        setPlaylists(data.playlists);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlaylists();
  }, []);

  // ✅ Close menu
  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  // ✅ DELETE PLAYLIST (FIXED)
  const handleDelete = async (playlistId) => {
    try {
      console.log("Deleting playlist:", playlistId);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/playlists/deleteplaylist/${playlistId}`, // ✅ FIX HERE
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log("DELETE RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      // ✅ update UI
      setPlaylists((prev) =>
        prev.filter((p) => p._id !== playlistId)
      );

      setOpenMenuId(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Your Playlists
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="relative cursor-pointer group"
            onClick={() =>
              navigate(`/playlist/${playlist._id}`)
            }
          >
            {/* 🎯 3 DOT BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(
                  openMenuId === playlist._id
                    ? null
                    : playlist._id
                );
              }}
              className="
                absolute bottom-2 right-2 z-20
                w-9 h-9 flex items-center justify-center
                rounded-full
                bg-black/80 text-white
                hover:bg-gray-700
                shadow-md cursor-pointer
              "
            >
              ⋮
            </button>

            {/* 🎯 DROPDOWN */}
            {openMenuId === playlist._id && (
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
                  onClick={() =>
                    handleDelete(playlist._id)
                  }
                  className="
                    w-full text-left px-3 py-2 text-sm rounded
                    text-gray-800 dark:text-white
                    hover:bg-gray-100 dark:hover:bg-gray-700 
                  "
                >
                  Delete playlist
                </button>
              </div>
            )}

            {/* Thumbnail */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
              {playlist.videos &&
              playlist.videos.length > 0 ? (
                <img
                  src={playlist.videos[0].thumbnail}
                  alt="playlist thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
                  No videos
                </div>
              )}

              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {playlist.videos.length} videos
              </div>
            </div>

            {/* Title */}
            <h3 className="mt-2 text-sm font-medium">
              {playlist.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;