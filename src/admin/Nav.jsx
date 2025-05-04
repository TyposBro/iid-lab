import { useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MenuButton from "@/components/MenuButton";
import { isTokenExpired } from "@/utils/jwt"; // Assuming this function works correctly

const AdminNav = () => {
  // 1. Use useNavigate hook
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
    if (!isAdmin) {
      console.log("Redirecting to /admin because isAdmin is false.");
      // Navigate to the admin login page (or wherever non-admins should go)
      navigate("/admin", { replace: true }); // Use replace: true to avoid adding the current page to history
    }
    // Dependency array: This effect should re-run if isAdmin or navigate changes
  }, [isAdmin, navigate]);

  // 5. Conditionally render the component *or* null while redirecting
  // If not admin, return null immediately to prevent rendering the admin UI
  // The useEffect above will handle the actual navigation action.
  if (!isAdmin) {
    return null;
  }

  // If isAdmin is true, render the actual navigation component
  return (
    <div className="flex flex-row justify-between px-[30px] py-[25px] bg-white fixed z-10 w-full max-w-5xl">
      {/* Pass necessary props. Note: isAdmin might be redundant here if MenuButton doesn't strictly need it */}
      {/* since the parent component already guards rendering */}
      <MenuButton navigate={navigate} defaultChecked={true} isAdmin={isAdmin} />
      {/* Add other admin nav items here */}
      {/* Example: <Link to="/admin/dashboard">Dashboard</Link> */}
      {/* Example: <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
};

export default AdminNav;
