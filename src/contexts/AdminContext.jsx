import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "@/config/api";

const AdminContext = createContext({
  isAdmin: false,
  // eslint-disable-next-line no-unused-vars
  loginAdmin: (token) => {},
  logoutAdmin: () => {},
  adminToken: null,
  baseUrl: BASE_URL,
});

// eslint-disable-next-line react/prop-types
export const AdminProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));
  const [isAdmin, setIsAdmin] = useState(!!adminToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (adminToken) {
      try {
        const decodedToken = jwtDecode(adminToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log("Admin token has expired");
          localStorage.removeItem("adminToken");
          setAdminToken(null);
          setIsAdmin(false);
          // Optionally redirect to login page here if not already on it
          if (window.location.pathname == "/admin-dashboard") {
            navigate("/admin");
          }
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("adminToken");
        setAdminToken(null);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [adminToken, navigate]);

  const loginAdmin = (token) => {
    setAdminToken(token);
    setIsAdmin(true);
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setIsAdmin(false);
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <AdminContext.Provider
      value={{ isAdmin, loginAdmin, logoutAdmin, adminToken, baseUrl: BASE_URL }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
