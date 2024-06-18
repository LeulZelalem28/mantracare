
import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('roles') || '');
  const [username, setUserName] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    localStorage.setItem('accessToken', accessToken);
  }, [accessToken]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('roles', userRole);
  }, [userRole]);

  return (
    <GlobalStateContext.Provider value={{ accessToken, setAccessToken, userRole, setUserRole, username, setUserName }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
