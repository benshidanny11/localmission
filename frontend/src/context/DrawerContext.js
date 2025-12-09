import React, { createContext, useState, useEffect } from 'react';

// Create the DrawerContext
export const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const [drawerVisible, setDrawerVisible] = useState(true);

  useEffect(() => {
    const drawerVisibleVar = localStorage.getItem('drawerVisible');
    if (drawerVisibleVar !== null) {
      setDrawerVisible(JSON.parse(drawerVisibleVar));
    } else {
      localStorage.setItem('drawerVisible', false);
      setDrawerVisible(false);
    }
  }, []);

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    localStorage.setItem('drawerVisible', false);
  };

  const handleDrawerOpen = () => {
    setDrawerVisible(true);
    localStorage.setItem('drawerVisible', true);
  };

  return (
    <DrawerContext.Provider
      value={{ drawerVisible, handleDrawerOpen, handleDrawerClose }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
