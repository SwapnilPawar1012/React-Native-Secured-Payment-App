import React, { createContext, useContext, useState } from "react";

// create context
const AppContext = createContext({
    phoneNumberGlobal: '',
    setPhoneNumberGlobal: () => {},
});

export const AppProvider = ({ children }) => {
    const [phoneNumberGlobal, setPhoneNumberGlobal] = useState('');

    return (
        <AppContext.Provider value={{ phoneNumberGlobal, setPhoneNumberGlobal }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
