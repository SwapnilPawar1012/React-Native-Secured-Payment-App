import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAppLockContext } from "./AppLockContext";
import { useAdvanceProtectionContext } from "./AdvanceProtectionContext";

// create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState('');

    const { checkLock } = useAppLockContext();
    const { checkAdvanceProtection } = useAdvanceProtectionContext();

    // Function to check authentication status when app starts
    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('authSafePay');
            const phone = await AsyncStorage.getItem('userSafePay');
            console.log("Auth Check: Token ->", token, "Phone ->", phone);
            if (token === 'true' && phone) {
                setIsAuthenticated(true);
                setUser(phone);
                checkLock();
                checkAdvanceProtection();
            } else {
                setIsAuthenticated(false);
                setUser('');
            }
        } catch (error) {
            console.log("Error checking auth:", error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);  // Runs once when component mounts

    // Function to login (set token and user)
    const login = async (userNo) => {
        console.log("Logging in with phone number:", userNo); // Debugging

        if (!userNo) {
            console.log("Phone number is empty or undefined!");
            return;
        }

        try {
            await AsyncStorage.setItem('authSafePay', 'true');
            await AsyncStorage.setItem('userSafePay', userNo);
            setIsAuthenticated(true);
            setUser(userNo);
            console.log("User logged in successfully!");
        } catch (error) {
            console.log("Error in login:", error);
        }
    };

    // Function to logout (remove token and user)
    const logout = async () => {
        // AsyncStorage.clear().then(() => console.log("Cleared AsyncStorage!"));
        try {
            await AsyncStorage.multiRemove(['authSafePay', 'userSafePay']);
            setIsAuthenticated(false);
            setUser('');
            console.log("User logged out!");
        } catch (error) {
            console.log("Error in logout:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);