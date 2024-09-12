import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  isEmployer: false, // Added this property
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (user, token) => {
    if (!user || !token) {
      console.log("Invalid user or token");
      return;
    }

    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Derive `isEmployer` from user object or handle it separately
  const isEmployer = user?.isEmployer || false;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user && !!token,
        userId: user?.id || null,
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
