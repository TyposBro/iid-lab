import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { Contact, Home, News, Projects, Publications, Team } from "./pages/index";
import { Navbar, Footer } from "./components/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/projects", element: <Projects /> },
      { path: "/publications", element: <Publications /> },
      { path: "/team", element: <Team /> },
      { path: "/news", element: <News /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
