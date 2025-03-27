import React, { createContext, useState, useContext,useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// Create a context
const GlobalStateContext = createContext();

// Create a provider component
export const GlobalStateProvider = ({ children }) => {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const login = localStorage.getItem("login");
    //console.log(login)
     if (login === "true") {
      dologin();
    } else {
      dologout();
    }
  }, [])
  const dologin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("login",true);
  }
  const dologout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("login",false);
    localStorage.removeItem("Uname");
    localStorage.removeItem("City");
  };
  return (
    <GlobalStateContext.Provider value={{ isLoggedIn, dologin, dologout }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to use the context
export const useGlobalState = () => useContext(GlobalStateContext);
