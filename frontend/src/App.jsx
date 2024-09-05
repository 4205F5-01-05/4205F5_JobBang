import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./containers/Roots";
import RegisterLogin from "./components/loginRegister/RegisterLogin";
import offreEmploi from "./components/joboffer/joboffer";
import PublierOffre from "./components/publierOffre/PublierOffre";
import MesOffres from "./components/mesOffres/MesOffres";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/Signup", element: <RegisterLogin /> },
      { path: "/offreEmploi", element: <offreEmploi /> },
    ],
  },
]);

const routerLogin = createBrowserRouter([
  {
    path: "/",
    element: <PublierOffre />,
    children: [{ path: "/mesOffres", element: <MesOffres /> }],
  },
]);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  console.log("isLoggedIn", isLoggedIn);
  if (isLoggedIn) {
    console.log("User conn.");
    return (
      <AuthContext.Provider
        value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
      >
        <RouterProvider router={routerLogin} />
      </AuthContext.Provider>
    );
  } else {
    console.log("User deco");

    return (
      <AuthContext.Provider
        value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );
  }
};

export default App;
