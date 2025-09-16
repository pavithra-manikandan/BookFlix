import { useState, createContext, useContext } from "react";

// Create AuthContext
const AuthContext = createContext();

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    // Example validation: You can replace this with API call to check credentials
    if (email === 'test@example.com' && password === 'password') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the context
export const useAuth = () => {
  return useContext(AuthContext);
};
