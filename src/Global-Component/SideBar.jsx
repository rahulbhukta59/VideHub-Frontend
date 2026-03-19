import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import HistoryIcon from "@mui/icons-material/History";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DownloadIcon from "@mui/icons-material/Download";
import SchoolIcon from "@mui/icons-material/School";

const SideBar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/subscriptions/mysubscription`,
          { credentials: "include" },
        );

        if (!res.ok) return;

        const data = await res.json();

        setSubscriptions(data.channels);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/playlists/get/user`,
          { credentials: "include" },
        );

        if (!res.ok) return;

        const data = await res.json();

        setPlaylists(data.playlists);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubscriptions();
    fetchPlaylists();
  }, []);
  return (
    <div className="fixed top-14 left-0 w-60 h-[calc(100vh-56px)] 
        bg-white text-black 
        dark:bg-black dark:text-white 
        overflow-y-auto border-r border-gray-200 dark:border-[#272727] hide-scrollbar">
      <div className="px-3 py-3">
        {/* HOME SECTION */}
        <Section>
          <NavItem
            icon={<HomeIcon />}
            text="Home"
            onClick={() => navigate("/")}
          />
          <NavItem icon={<SmartDisplayIcon />} text="Shorts" />
        </Section>

        <Divider />

        {/* YOU SECTION */}
        <Section title="You">
          <NavItem
            icon={<HistoryIcon />}
            text="History"
            onClick={() => navigate("/history")}
          />
          <NavItem icon={<PlaylistPlayIcon />} text="Playlists" onClick={() => navigate("/playlists")} />
          <NavItem
            icon={<ThumbUpIcon />}
            text="Liked videos"
            onClick={() => navigate("/likedvideos")}
          />
          <NavItem
            icon={<VideoLibraryIcon />}
            text="Your videos"
            onClick={() => navigate("/yourvideos")}
          />
          <NavItem icon={<DownloadIcon />} text="Downloads" />
        </Section>

        <Divider />

        {/* SUBSCRIPTIONS */}
        <Section title="Subscriptions">
          {subscriptions.map((sub) => (
            <SubscriptionItem
              key={sub.channel._id}
              img={
                sub.channel.profileimage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              text={sub.channel.username}
              onClick={() => navigate(`/channel/${sub.channel.username}`)}
            />
          ))}
        </Section>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="mb-4">
    {title && (
      <h3 className="text-xs text-gray-500 dark:text-gray-400 font-semibold px-3 py-2 uppercase tracking-wider">
        {title}
      </h3>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

const NavItem = ({ icon, text, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-6 px-3 py-2 rounded-lg cursor-pointer
      hover:bg-gray-200 dark:hover:bg-[#272727] transition
      ${active ? "bg-[#272727] font-medium" : ""}`}
  >
    <div className="text-xl">{icon}</div>
    <span className="text-sm">{text}</span>
  </div>
);

const SubscriptionItem = ({ img, text, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-[#272727] cursor-pointer transition"
  >
    <img src={img} alt="profile" className="w-6 h-6 rounded-full" />
    <span className="text-sm truncate">{text}</span>
  </div>
);

const Divider = () => <div className="border-t border-[#272727] my-3"></div>;

export default SideBar;
