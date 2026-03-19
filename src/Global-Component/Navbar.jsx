import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { IoCloudUploadOutline } from "react-icons/io5";

const Navbar = ({
  toggleSidebar,
  openAuth,
  openUpload,
  isAuthenticated,
  setIsAuthenticated,
  user,
}) => {

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
   const [darkMode, setDarkMode] = useState(false);

  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.style.background = "black";
    } else {
      document.body.style.background = "white";
    }
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setIsAuthenticated(false);
      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ================= SEARCH =================
  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  };

  // ================= VOICE SEARCH =================
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setQuery(text);
      navigate(`/search?q=${text}`);
    };

    recognition.start();
  };

  return (
    <div className="flex items-center justify-between px-4 h-14 bg-black text-white fixed top-0 left-0 right-0 z-[9999] pointer-events-auto">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <MenuIcon className="cursor-pointer" onClick={toggleSidebar} />

        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <OndemandVideoIcon sx={{ color: "red", fontSize: 32 }} />
          <span className="text-2xl font-bold tracking-tight">
            VideHub
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex items-center w-[40%] max-w-xl">
        <div className="flex flex-1">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 px-3 py-2 bg-[#121212] border border-gray-700 rounded-l-full outline-none text-white"
          />

          <button
            onClick={handleSearch}
            className="px-4 bg-[#222] border border-gray-700 rounded-r-full cursor-pointer"
          >
            <SearchIcon />
          </button>
        </div>

        <div
          onClick={startVoiceSearch}
          className="ml-3 p-2 bg-[#222] rounded-full cursor-pointer"
        >
          <MicIcon />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5 relative" ref={menuRef}>

        {/* Upload */}
        <IoCloudUploadOutline
          className="cursor-pointer size-6 border border-gray-700 rounded-full"
          onClick={() => {
            if (!isAuthenticated) {
              openAuth("login");
              return;
            }
            openUpload();
          }}
        />

        {/* Notifications */}
        <NotificationsIcon />

      {/* ✅ THIS WILL WORK */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log("clicked"); // debug
          setDarkMode((prev) => !prev);
        }}
        className="p-2 bg-black text-white rounded-full z-[999999]"
      >
        <DarkModeIcon />
      </button>

        {/* Profile */}
        {/* <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="profile"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setOpen(!open)}
        /> */}

        <img
          src={
            user?.profileimage ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="profile"
          className="w-8 h-8 rounded-full cursor-pointer object-cover"
          onClick={() => setOpen(!open)}
        />

        {/* DROPDOWN */}
        {open && (
          <div className="absolute top-12 right-0 w-48 bg-[#212121] border border-[#333] rounded-lg shadow-lg py-2 z-[10000]">

            <div
              className="px-4 py-2 hover:bg-[#333] cursor-pointer"
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
            >
              Profile
            </div>

            {!isAuthenticated ? (
              <div
                className="px-4 py-2 hover:bg-[#333] cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  openAuth("login");
                }}
              >
                Login
              </div>
            ) : (
              <div
                className="px-4 py-2 hover:bg-[#333] cursor-pointer text-red-500"
                onClick={handleLogout}
              >
                Logout
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;