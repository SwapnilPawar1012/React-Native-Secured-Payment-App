import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from "react";

const AdvanceProtectionContext = createContext();

export const AdvanceProtectionProvider = ({ children }) => {
    const [advanceProtected, setAdvanceProtected] = useState(false);

    const [isAdvanceProtection, setIsAdvanceProtection] = useState('');
    console.log("isAdvanceProtected: ", isAdvanceProtection)

    const enableAdvanceProtection = async (method) => {
        try {
            await AsyncStorage.setItem("SafePay-AdvanceProtection", method);
            setIsAdvanceProtection(method)
            console.log("Advance Payment Protection Enabled")
        } catch (error) {
            console.log("Error in Enabling Advance Payment Protection: ", error);
        }
    }

    const disableAdvanceProtection = async () => {
        try {
            await AsyncStorage.removeItem("SafePay-AdvanceProtection");
            setIsAdvanceProtection("")
            console.log("Advance Payment Protection Disable")
        } catch (error) {
            console.log("Error in Disabling Advance Payment Protection: ", error);
        }
    }

    const checkAdvanceProtection = async () => {
        try {
            const AdvanceLock = await AsyncStorage.getItem("SafePay-AdvanceProtection");
            console.log("Advance Payment Protection status:", AdvanceLock);
            if (AdvanceLock === "SProtected") {
                setIsAdvanceProtection("SProtected");
            }
            else if (AdvanceLock === "AProtected") {
                setIsAdvanceProtection("AProtected");
            }
            else {
                setIsAdvanceProtection("");
            }
        } catch (error) {
            console.log("Error in Fetching Advance Payment Protection Status: ", error);
        }
    }

    return (
        <AdvanceProtectionContext.Provider value={{
            isAdvanceProtection,
            advanceProtected,
            setAdvanceProtected,
            enableAdvanceProtection, disableAdvanceProtection, checkAdvanceProtection
        }}>
            {children}
        </AdvanceProtectionContext.Provider>
    )
}

export const useAdvanceProtectionContext = () => useContext(AdvanceProtectionContext);