import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Login = ({
  switchToSignup,
  switchToForgot,
  closeModal,
  setIsAuthenticated,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login successful:", data);

      setIsAuthenticated(true);

      setLoading(false);
      closeModal();
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px] relative">
      <button
        onClick={closeModal}
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-black mb-6 text-center">
        Login to Your Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          {/* <label className="block text-sm text-gray-700 mb-1">Email</label> */}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password with Eye Icon */}
        <div className="relative">

  <input
    type={showPassword ? "text" : "password"}
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter your password"
    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
  >
    {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
  </span>

</div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-800 text-white py-2 rounded-md font-medium transition cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-right text-sm mt-3">
        <span
          onClick={switchToForgot}
          className="text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white px-2 py-1 rounded-md"
        >
          Forgot Password?
        </span>
      </p>

      <p className="text-center text-sm mt-6">
        Don't have an account?{" "}
        <span
          onClick={switchToSignup}
          className="text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white px-2 py-1 rounded-md"
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;