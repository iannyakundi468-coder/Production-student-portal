import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../lib/api';

export type Role = 'guardian' | 'staff' | 'admin' | 'student';

export interface User {
    name: string;
    role: Role;
    id: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const payload: any = { email, password };
            const data = await api.post<{ token: string; user?: User }>('/auth/login', payload);
            
            if (!data.user || !data.user.role) {
                throw new Error("Invalid response from server: Role is missing.");
            }

            let userObj: User = data.user;
            if ((userObj.role as any) === 'teacher') userObj.role = 'staff';
            if ((userObj.role as any) === 'parent') userObj.role = 'guardian';
            
            setUser(userObj);
            localStorage.setItem('somobloom_token', data.token);
            localStorage.setItem('somobloom_user', JSON.stringify(userObj));
        } catch (error: any) {
            console.error('Login failed:', error);
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
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role === 'teacher') parsedUser.role = 'staff';
            if (parsedUser.role === 'parent') parsedUser.role = 'guardian';
            setUser(parsedUser);
            
            // Re-save normalized user back to storage to prevent issues on next load
            localStorage.setItem('somobloom_user', JSON.stringify(parsedUser));
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
