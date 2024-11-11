import React, { createContext, useContext, useState } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the application
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [mode,setMode]=useState("light");

  // Function to log in
  const login = (user,authToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', authToken); 

    setIsLoggedIn(true);
  };

  const toggle=()=>{
    if(mode==="light")
    {
        setMode("dark");
    }
    else
    {
        setMode("light")
    }
  }

  // Function to log out
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout,toggle,mode }}>
      {children}
    </AuthContext.Provider>
  );
}
