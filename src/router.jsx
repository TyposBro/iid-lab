import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { Home, About, Projects, Publications, Team, News, Gallery, Prof } from "pages/";
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
      { path: "/news", element: <News /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/projects", element: <Projects /> },
      { path: "/publications", element: <Publications /> },
      { path: "/team", element: <Team /> },
      { path: "/about", element: <About /> },
      { path: "/professor", element: <Prof /> },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
