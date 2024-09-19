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
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLogging] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
  
      if (storedUser && storedToken) {
        // Check if the storedUser is a valid JSON string before parsing
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      // Clear the invalid data from localStorage
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
    setUserId(user.rId);  // Set the userId state
    setIsLogging(true);  // Set the isLoggedIn state

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserId(null);
    setIsLogging(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Derive `isEmployer` from user object or handle it separately
  const isEmployer = user?.isEmployer || false;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user && !!token,
        userId: user?.rId || null,
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
