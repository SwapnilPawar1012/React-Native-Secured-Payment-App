import React, { createContext, useContext, useState } from "react";

// create context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [phoneNumberGlobal, setPhoneNumberGlobal] = useState('');

    return (
        <AppContext.Provider value={{ phoneNumberGlobal, setPhoneNumberGlobal }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);