import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import HomePage from "./HomePage";
import ErrorPage from "./ErrorPage";
import EventPage from "./EventPage";
import RegisterPage from "./RegisterPage";

function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/event/:id",
          element: <EventPage />,
        },
        {
          path: "/register/:id",
          element: <RegisterPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
