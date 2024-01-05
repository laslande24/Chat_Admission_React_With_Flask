import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage.jsx";
import { Signin, Signup, ForgotPassword } from "./components/sigin_signup";
import { ChatBox } from "./components/chat";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <Signin />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot_password",
    element: <ForgotPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/chat",
    element: <ChatBox />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
