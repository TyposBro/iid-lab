// router.js
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { AdminProvider } from "@/contexts/AdminContext";

import { Home, About, Projects, Publications, Team, News, Gallery, Prof } from "@/pages/";
import { Navbar, Footer } from "@/components/";
import AdminLogin from "@/components/AdminLogin"; // Import the AdminLogin component

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AdminProvider>
        <Navbar />
        <Outlet />
        <Footer />
      </AdminProvider>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/news", element: <News /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/projects", element: <Projects /> },
      { path: "/publications", element: <Publications /> },
      { path: "/team", element: <Team /> },
      { path: "/about", element: <About /> },
      { path: "/prof", element: <Prof /> },
    ],
  },
  {
    path: "/admin/login", // Define the route for the login page
    element: (
      <AdminProvider>
        <AdminLogin />
      </AdminProvider>
    ),
  },
  {
    path: "/admin-dashboard", // Example route for a protected admin dashboard
    element: (
      <AdminProvider>
        <div>
          <h1>Admin Dashboard</h1>
          {/* Add your admin dashboard components here */}
        </div>
      </AdminProvider>
    ),
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
