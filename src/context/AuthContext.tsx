import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../lib/api';

type Role = 'guardian' | 'staff' | 'admin';

interface User {
    name: string;
    role: Role;
    id: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: Role) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string, role: Role) => {
        try {
            // We pass the role to the backend to ensure the user is logging into the correct portal context
            const data = await api.post<{ token: string; user: User }>('/auth/login', { email, password, role });
            
            setUser(data.user);
            localStorage.setItem('somobloom_token', data.token);
            localStorage.setItem('somobloom_user', JSON.stringify(data.user));
        } catch (error: any) {
            console.error("Login failed:", error.message);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('somobloom_token');
        localStorage.removeItem('somobloom_user');
    };

    // Load user from local storage
    React.useEffect(() => {
        const storedUser = localStorage.getItem('somobloom_user');
        const token = localStorage.getItem('somobloom_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// The St Joseph's Kisii South Academy V1.0
