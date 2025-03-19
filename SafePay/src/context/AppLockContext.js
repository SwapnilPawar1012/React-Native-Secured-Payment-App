import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState } from "react";

// create context
const AppLockContext = createContext();

export const AppLockProvider = ({ children }) => {
    const [isLocked, setIsLocked] = useState(false);
    const [lockedAuth, setLockedAuth] = useState(false);

    // Function to lock app
    const lock = async () => {
        try {
            await AsyncStorage.setItem('SafePayLock', 'true');
            setIsLocked(true);
            console.log("App locked successfully!");
        } catch (error) {
            console.log("Error in locking app:", error);
        }
    };

    // Function to unlock app
    const unlock = async () => {
        try {
            await AsyncStorage.removeItem('SafePayLock');
            setIsLocked(false);
            console.log("App unlocked successfully!");
        } catch (error) {
            console.log("Error in unlocking app:", error);
        }
    };

    const checkLock = async () => {
        try {
            const lock = await AsyncStorage.getItem('SafePayLock');
            console.log("Lock status:", lock);
            setIsLocked(lock === 'true');
        } catch (error) {
            console.log("Error checking lock:", error);
        }
    }

    return (
        <AppLockContext.Provider value={{ isLocked, lock, unlock, checkLock, lockedAuth, setLockedAuth }}>
            {children}
        </AppLockContext.Provider>
    );
}

export const useAppLockContext = () => useContext(AppLockContext)