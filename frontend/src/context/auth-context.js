import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  user: null,
  token: null,
  isEmployer: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const isLoggedIn = !!user && !!token;

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      console.log("Stored user in useEffect: ", storedUser);
      console.log("Stored token in useEffect: ", storedToken);

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        setUserId(parsedUser.rId);
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const login = (user, token) => {
    if (!user || !token) {
      console.log("Invalid user or token");
      return;
    }

    console.log("Logging in user:", user, "with token:", token);

    setUser(user);
    setToken(token);
    setUserId(user._id);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserId(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isEmployer = user?.isEmployer || false;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userId: user?._id || null,
        user,
        token,
        isEmployer,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
