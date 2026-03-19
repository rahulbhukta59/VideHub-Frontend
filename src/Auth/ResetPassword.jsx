import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {

    e.preventDefault();

    if (!newPassword) {
      alert("Enter new password");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Password reset successful");
      navigate("/");

    } catch (error) {

      alert("Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px]">

        <h2 className="text-2xl font-bold text-center mb-2">
          Reset Password
        </h2>

        {email && (
          <p className="text-sm text-gray-500 text-center mb-6">
            Reset password for <span className="font-medium">{email}</span>
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Go back
          </span>
        </p>

      </div>

    </div>

  );

};

export default ResetPassword;
