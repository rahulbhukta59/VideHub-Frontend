import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Global-Component/Navbar.jsx";
import SideBar from "./Global-Component/SideBar.jsx";
import FilterBar from "./Global-Component/FilterBar.jsx";
import Video from "./Component/Video.jsx";
import WatchVideo from "./Component/WatchVideo.jsx";
import SearchPage from "./Component/SearchPage.jsx";
import Login from "./Auth/Login.jsx";
import Signup from "./Auth/Signup.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";
import ResetPassword from "./Auth/ResetPassword.jsx";
import UploadVideo from "./Component/UploadVideo.jsx";
import History from "./Component/History.jsx";
import LikedVideos from "./Component/LikedVideos.jsx";
import YourVideos from "./Component/YourVideos.jsx";
import VideoPlayer from "./Component/VideoPlayer.jsx";
import PlaylistPage from "./Component/PlaylistPage.jsx";
import PlaylistVideo from "./Component/PlaylistVideo.jsx";
import Divider from "@mui/material/Divider";
import ChannelPage from "./Component/ChannelPage.jsx";
import Profile from "./Component/Profile.jsx";

function App() {

  const [isOpen, setIsOpen] = useState(true);
  const [authMode, setAuthMode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const [user, setUser] = useState(null);
  
  const [refreshVideos, setRefreshVideos] = useState(false);

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/users/current`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
      }


      } catch (error) {
        console.log("User not logged in",error);
      }

    };

    checkAuth();

  }, []);

  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR */}
      <Navbar
        toggleSidebar={() => setIsOpen(!isOpen)}
        openAuth={(mode) => setAuthMode(mode)}
        openUpload={() => setShowUpload(true)}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        user={user}  
      />

      {/* SIDEBAR */}
      {isOpen && <SideBar />}

      {/* MAIN CONTENT */}
      <div
        className={`flex flex-col grow pt-14 transition-all duration-300 ${
          isOpen ? "ml-60" : "ml-16"
        }`}
      >

        <FilterBar isOpen={isOpen} />
        {/* <VideoPlayer/> */}

        {/* ROUTES */}
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={<Video refreshVideos={refreshVideos} />}
          />

          {/* WATCH VIDEO */}
          <Route
            path="/watch/:id"
            element={<WatchVideo />}
          />

          {/* SEARCH */}
          <Route
            path="/search"
            element={<SearchPage />}
          />

          <Route path="/history" element={<History />} />

          <Route path="/likedvideos" element={<LikedVideos/>}/>

          <Route path="/yourvideos" element={<YourVideos />} />

          <Route path="/playlists" element={<PlaylistPage />} />

          <Route path="/playlist/:playlistId" element={<PlaylistVideo />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/channel/:username" element={<ChannelPage />} />

        </Routes>

      </div>

      {/* AUTH MODAL */}
      {authMode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          {authMode === "login" && (
            <Login
              switchToSignup={() => setAuthMode("signup")}
              switchToForgot={() => setAuthMode("forgot")}
              closeModal={() => setAuthMode(null)}
              setIsAuthenticated={setIsAuthenticated}
            />
          )}

          {authMode === "signup" && (
            <Signup
              switchToLogin={() => setAuthMode("login")}
              closeModal={() => setAuthMode(null)}
            />
          )}

          {authMode === "forgot" && (
            <ForgotPassword
              switchToLogin={() => setAuthMode("login")}
              closeModal={() => setAuthMode(null)}
            />
          )}

        </div>
      )}

      {/* VIDEO UPLOAD MODAL */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <UploadVideo
            closeModal={() => setShowUpload(false)}
            refreshVideos={() => setRefreshVideos(!refreshVideos)}
          />

        </div>
      )}
    </div>


  );
}

export default App;