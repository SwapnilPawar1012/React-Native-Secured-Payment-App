import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

// create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState('');

    // Check if user is authenticated
    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('authSafePay');
            const phone = await AsyncStorage.getItem('userSafePay');
            if (token && phone) {
                if (token === 'true') {
                    setIsAuthenticated(true);
                    setUser(phone);
                } else {
                    setIsAuthenticated(false);
                    setUser('')
                }
            } else {
                setIsAuthenticated(false);
                setUser('')
            }
        }
        checkAuth();
    }, [])

    // Function to login (set token and user)
    const login = async () => {
        await AsyncStorage.setItem('authSafePay', 'true');
        await AsyncStorage.setItem('userSafePay', '1234567890');
        setIsAuthenticated(true);
        setUser('1234565345');
    }

    // Function to logout (remove token and user)
    const logout = async () => {
        await AsyncStorage.removeItem('authSafePay');
        await AsyncStorage.removeItem('userSafePay');
        setIsAuthenticated(false);
        setUser("")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);