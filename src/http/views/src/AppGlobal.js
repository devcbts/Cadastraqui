import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppState = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [isShown, setIsShown] = useState(true);

  const handleClick = () => {
    setIsShown((prev) => !prev);
  };

  return (
    <AppContext.Provider value={{ isShown, setIsShown, handleClick }}>
      {children}
    </AppContext.Provider>
  );
};
