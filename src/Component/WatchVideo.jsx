import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "./CommentSection.jsx";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { MdContentCopy } from "react-icons/md";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import VideoPlayer from "./VideoPlayer.jsx"


const WatchVideo = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const hasFetched = useRef(false);
  

const [videoData, setVideoData] = useState(null);
const [likes, setLikes] = useState(0);
const [dislikes, setDislikes] = useState(0);
const [subscribed, setSubscribed] = useState(false);
const [subscribersCount, setSubscribersCount] = useState(0);
const [playlists, setPlaylists] = useState([]);
const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
const [newPlaylistName, setNewPlaylistName] = useState("");
const [currentUser, setCurrentUser] = useState(null);

  const uploadDate = videoData?.createdAt
    ? new Date(videoData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const getCurrentUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/current`,
        { credentials: "include" },
      );

      // if (!res.ok) return null;
      if (!res.ok) {
  const text = await res.text();
  console.log("ERROR:", res.status, text);
  return null;
}

      const data = await res.json();
      return data.user;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  // subscribers count

  const fetchSubscribers = async (channelId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/subscriptions/channelsubscribers/${channelId}`,
        { credentials: "include" },
      );

      if (!res.ok) return;

      const data = await res.json();

      setSubscribersCount(data.totalSubscribers || 0);

      const currentUser = await getCurrentUser();

      if (currentUser && data.subscribers) {
        const isSubscribed = data.subscribers.some(
          (sub) => sub.subscriber?._id === currentUser._id,
        );

        setSubscribed(isSubscribed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* FETCH VIDEO */
  useEffect(() => {
  getCurrentUser().then(setCurrentUser);
}, []);

  useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/videos/${id}`,
          { credentials: "include" },
        );

        // user not logged in
        if (res.status === 401) {
          alert("Please log in to watch the video");
          return;
        }

        const data = await res.json();

        console.log("VIDEO DATA:", data.video);
        console.log("OWNER:", data.video.owner);

        setVideoData(data.video);
        setLikes(data.likesCount || 0);
        setDislikes(data.dislikesCount || 0);
        fetchSubscribers(data.video.owner._id);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVideo();
  }, [id]);

  // Fetch Playlist
  useEffect(() => {

  const fetchPlaylists = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/playlists/get/${id}`,
        { credentials: "include" }
      );

      if (!res.ok) return;

      const data = await res.json();

      setPlaylists(data.playlists || []);

    } catch (error) {
      console.log(error);
    }

  };

  fetchPlaylists();

}, []);

// Add video to playlist

const addToPlaylist = async (playlistId) => {

  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/playlists/addvideo/${playlistId}/videos/${videoData._id}`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    const data = await res.json();

    alert(data.message);

  } catch (error) {
    console.log(error);
  }

};

// Create new playlists

const createPlaylist = async () => {

  if (!newPlaylistName) return;

  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/playlists/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name: newPlaylistName,
          description: "My playlist"
        })
      }
    );

    const data = await res.json();

    setPlaylists((prev) => [...prev, data.playlist]);

    setNewPlaylistName("");

  } catch (error) {
    console.log(error);
  }

};

  /* HLS VIDEO PLAYER */

  // useEffect(() => {
  //   if (!videoData) return;

  //   const video = videoRef.current;
  //   const streamUrl = `${import.meta.env.VITE_API_URL}${videoData.videoFile}`;

  //   if (Hls.isSupported()) {
  //     const hls = new Hls();
  //     hls.loadSource(streamUrl);
  //     hls.attachMedia(video);
  //   } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
  //     video.src = streamUrl;
  //   }
  // }, [videoData]);

  /* LIKE / DISLIKE */

  const handleLike = async (type) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/likes/video/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ type }),
        },
      );

      const data = await res.json();

      setLikes(data.likesCount);
      setDislikes(data.dislikesCount);
    } catch (error) {
      console.log(error);
    }
  };

  /* SHARE */

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Video link copied!");
  };

  if (!videoData) return <div className="p-10">Loading...</div>;

  // subscribe

  const handleSubscribe = async () => {
    const currentUser = await getCurrentUser();

if (!currentUser) {
  alert("Please login first to subscribe");
  return;
}

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/subscriptions/togglesubscription/${videoData.owner._id}/${videoData.owner._id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      // if backend rejected
      if (!res.ok) {
        alert("Please login first to subscribe");
        return;
      }

      const data = await res.json();

      setSubscribed(data.subscribed);

      if (data.subscribed) {
        setSubscribersCount((prev) => prev + 1);
      } else {
        setSubscribersCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center px-6 py-6">
      <div className="flex gap-8 max-w-[1400px] w-full">
        <div className="flex-1 max-w-[900px]">
          {/* VIDEO PLAYER */}
          <VideoPlayer
            // ref={videoRef}
            // controls
            videoId={videoData._id}
            className="w-full aspect-video rounded-xl bg-black shadow-lg"
          />

          {/* TITLE */}
          <h1 className="text-xl font-semibold mt-4 flex items-center gap-2">
            <span>{videoData.title}</span>
            <span className="text-gray-400 font-normal">
              || {videoData.description}
            </span>
          </h1>

          {/* VIEWS */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-500 text-sm">
              {videoData.views} Views • {uploadDate}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              {/* LIKE */}
              <button
                onClick={() => handleLike("like")}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
              >
                <ThumbUpAltOutlinedIcon fontSize="small " />
                <span className="text-sm cursor-pointer">{likes}</span>
              </button>

              {/* DISLIKE */}
              <button
                onClick={() => handleLike("dislike")}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
              >
                <ThumbDownAltOutlinedIcon fontSize="small" />
                <span className="text-sm">{dislikes}</span>
              </button>

              {/* SHARE */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-200 transition"
              >
                <MdContentCopy  fontSize="small" />
                <span className="text-sm cursor-pointer">Copied link to share</span>
              </button>

               {/* SAVE BUTTON */}

            <button
              onClick={() => setShowPlaylistPopup(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-200 cursor-pointer"
            >
              <PlaylistAddIcon fontSize="small" />
              Save
            </button>

            </div>
          </div>

          {/* CHANNEL INFO */}
          <div className="flex items-center justify-between mt-6">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">
              <img
                src={
                  videoData?.owner?.profileimage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="channel"
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                {/* Channel Name */}
                <p className="font-semibold text-base">
                  {videoData.owner?.username}
                </p>

                {/* Subscriber Count */}
                <p className="text-sm text-gray-500">
                  {subscribersCount} subscribers
                </p>
              </div>
            </div>

            {/* SUBSCRIBE BUTTON */}
            <button
              onClick={handleSubscribe}
              // disabled={localStorage.getItem("userId") === videoData.owner?._id}
              disabled={false} // or remove condition temporarily
              className={`px-6 py-2 rounded-full font-semibold transition cursor-pointer
    ${
      subscribed
        ? "bg-gray-200 text-black"
        : "bg-green-600 text-white hover:bg-gray-400"
    } 
    ${
      localStorage.getItem("userId") === videoData.owner?._id
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* COMMENTS */}
          <div className="mt-8">
            <CommentSection videoId={id} />
          </div>
        </div>
      </div>


      {/* Playlists */}
      {showPlaylistPopup && (

<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

  <div className="bg-white p-6 rounded-2xl shadow-2xl w-[420px] max-w-[90%] relative">

    {/* CROSS BUTTON */}
    <button
      onClick={() => setShowPlaylistPopup(false)}
      className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold cursor-pointer"
    >
      ✕
    </button>

    {/* Header */}
    <h2 className="text-xl font-semibold text-gray-800 mb-5">
      Save to Playlist
    </h2>

    {/* PLAYLIST LIST */}

    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl mb-5">

      {playlists.length === 0 && (
        <p className="p-4 text-sm text-gray-500 text-center">
          No playlists yet
        </p>
      )}

      {playlists.map((playlist) => (

        <div
          key={playlist._id}
          onClick={() => addToPlaylist(playlist._id)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
        >

          <input
            type="checkbox"
            className="w-4 h-4 accent-indigo-600 cursor-pointer"
          />

          <span className="text-sm text-gray-700 font-medium">
            {playlist.name}
          </span>

        </div>

      ))}

    </div>

    {/* CREATE PLAYLIST */}

    <div className="border-t border-gray-200 pt-4">

      <p className="text-sm font-semibold text-gray-700 mb-3">
        Create New Playlist
      </p>

      <div className="flex gap-2">

        <input
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name"
          className="border border-gray-300 px-3 py-2.5 flex-1 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500 transition"
        />

        <button
          onClick={createPlaylist}
          className="bg-indigo-600 hover:bg-indigo-700 text-white
          px-4 py-2.5 rounded-lg font-medium transition cursor-pointer"
        >
          Create
        </button>

      </div>

    </div>

    {/* CLOSE BUTTON */}

    <button
      onClick={() => setShowPlaylistPopup(false)}
      className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white 
      py-2.5 rounded-lg font-medium transition cursor-pointer"
    >
      Close
    </button>

  </div>

</div>

)}
    </div>

    
  );
};

export default WatchVideo;











