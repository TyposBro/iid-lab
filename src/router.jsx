import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import { Home, About, Projects, Publications, Team, News, Gallery, Prof } from "@/pages/";
import { Navbar, Footer } from "@/components/";
import { AdminNav, AdminAuth } from "@/admin/";

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
    path: "/admin",
    element: (
      <AdminProvider>
        <AdminAuth />
      </AdminProvider>
    ),
  },
  {
    path: "/admin/nav",
    element: (
      <AdminProvider>
        <AdminNav />
      </AdminProvider>
    ),
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
