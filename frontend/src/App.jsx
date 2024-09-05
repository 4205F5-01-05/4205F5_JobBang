import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./containers/Roots";
import RegisterLogin from "./components/loginRegister/RegisterLogin";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ path: "/Signup", element: <RegisterLogin /> }],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
