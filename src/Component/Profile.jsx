import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [stats, setStats] = useState({
    videos: 0,
    subscribers: 0,
    views: 0
  });

  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/api/v1/users/current`, {
          credentials: "include",
        });

        const data = await res.json();

        setUser(data.user);
        setUsername(data.user.username);
        setEmail(data.user.email);
        setPreview(data.user.profileimage);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${API}/api/v1/users/channel-stats`,
        { credentials: "include" }
      );

      const data = await res.json();

      setStats({
        videos: data.videosCount,
        subscribers: data.subscribersCount,
        views: data.totalViews
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };



  /* UPDATE PROFILE */

  // const handleUpdate = async () => {
  //   try {
  //     //  setLoading(true);
  //     const formData = new FormData();

  //     formData.append("username", username);
  //     formData.append("email", email);

  //     if (image) {
  //       formData.append("profileimage", image);
  //     }

  //     const res = await fetch(`${API}/api/v1/users/updateaccount`, {
  //       method: "PUT",
  //       credentials: "include",
  //       body: formData,
  //     });

  //     const data = await res.json();

  //     alert(data.message);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleUpdate = async () => {
    if (isUpdating) return; // 🔒 prevent double click

    setIsUpdating(true);

    try {
      const formData = new FormData();

      formData.append("username", username);
      formData.append("email", email);

      if (image) {
        formData.append("profileimage", image);
      }

      const res = await fetch(`${API}/api/v1/users/updateaccount`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert(data.message);

    } catch (error) {
      console.log(error);
      alert("Update failed");
    } finally {
      setIsUpdating(false); 
    }
  };

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex justify-center py-10">

      <div className="bg-white shadow-xl rounded-xl p-8 w-[500px]">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Your Profile
        </h2>

        <div className="flex justify-center gap-10 mb-6">

          <div className="text-center">
            <p className="text-xl font-semibold">{stats.videos}</p>
            <p className="text-gray-500 text-sm">Videos</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold">{stats.subscribers}</p>
            <p className="text-gray-500 text-sm">Subscribers</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold">{stats.views}</p>
            <p className="text-gray-500 text-sm">Total Views</p>
          </div>

        </div>

        {/* PROFILE IMAGE */}

        <div className="flex flex-col items-center mb-6">

          <img
            src={
              preview ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border"
          />

          <input
            type="file"
            onChange={handleImageChange}
            className="mt-4 text-sm"
          />

        </div>

        {/* USERNAME */}

        <div className="mb-4">

          <label className="block text-sm mb-1">
            Username
          </label>

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

        </div>

        {/* EMAIL */}

        <div className="mb-6">

          <label className="block text-sm mb-1">
            Email
          </label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

        </div>

        {/* UPDATE BUTTON */}

        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className={`w-full py-2 rounded text-white transition
    ${isUpdating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-800 cursor-pointer"
            }`}
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>

      </div>

    </div>
  );
};

export default Profile;