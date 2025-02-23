import React, { createContext, useContext, useState, useCallback } from 'react';

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const maxLogs = 100;

  const logActivity = useCallback((action, details) => {
    // Don't log if the user is an admin
    if (details.user === 'primiel1423@gmail.com') {
      return;
    }

    const logData = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      action,
      details,
      type: action
    };

    setLogs(prevLogs => [logData, ...prevLogs].slice(0, maxLogs));
  }, []);

  return (
    <ActivityContext.Provider value={{ logs, logActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};