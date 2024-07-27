import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const OrderProvider = ({ children }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  return (
    <AppContext.Provider value={{ selectedOrderId, setSelectedOrderId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
