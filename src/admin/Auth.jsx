// {PATH_TO_THE_PROJECT}/frontend/src/admin/Auth.jsx

import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/config/api";
import { isTokenExpired } from "@/utils/jwt";

const AdminAuth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();

  // 2. Get the token
  const token = localStorage.getItem("adminToken");

  // 3. Check if the token is valid (not expired)
  // Make sure isTokenExpired returns true if expired/missing, false if valid
  const isAdmin = token && !isTokenExpired(token);

  console.log("AdminNav: isAdmin", isAdmin);
  console.log("AdminNav: Token exists?", !!token);
  if (token) {
    console.log("AdminNav: Token expired?", isTokenExpired(token));
  }

  // 4. Use useEffect to handle the redirect side effect
  useEffect(() => {
    if (isAdmin) {
      console.log("Redirecting to /admin/nav because isAdmin is true.");
      // Navigate to the admin login page (or wherever non-admins should go)
      navigate("/admin/nav", { replace: true }); // Use replace: true to avoid adding the current page to history
    }
    // Dependency array: This effect should re-run if isAdmin or navigate changes
  }, [isAdmin, navigate]);

  // 5. Conditionally render the component *or* null while redirecting
  // If admin, return null immediately to prevent rendering the login UI
  // The useEffect above will handle the actual navigation action.
  if (isAdmin) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token);
        loginAdmin(data.token);
        navigate("/admin/nav"); // Adjust as needed
      } else {
        const errorData = await response.json();
        setLoginError(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Failed to connect to the server");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
        {loginError && <p className="text-red-500 text-xs italic mb-4">{loginError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="bg-primary_main text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
