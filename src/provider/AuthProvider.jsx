import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));

    const login = ({ token, user }) => {
        setToken(token);
        localStorage.setItem('token', token);
        const userData = { id: user.id, nombre: user.nombre, email: user.email, foto: user.foto, intereses: user.intereses }

        setUserInfo(userData)
        localStorage.setItem('userInfo', JSON.stringify(userData));

    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
    };

    const updateUserInfo = (data) => {
        setUserInfo(data)
        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    const isAuthenticated = () => {
        return !!token;
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated, userInfo, updateUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
