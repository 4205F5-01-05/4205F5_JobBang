import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./containers/Roots";
import RegisterLogin from "./components/loginRegister/RegisterLogin";
import offreEmploi from "./components/joboffer/joboffer";
import ListeEmploi from "./components/listeEmploi/listeEmploi";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/Signup", element: <RegisterLogin /> },
      { path: "/offreEmploi", element: <offreEmploi /> },
      { path: "/listeEmploi", element: <ListeEmploi /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;