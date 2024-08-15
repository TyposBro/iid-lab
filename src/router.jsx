import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { Home, About, Projects, Publications, Team } from "pages/";
import { Navbar, Footer } from "components/";

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
      { path: "/about", element: <About /> },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
