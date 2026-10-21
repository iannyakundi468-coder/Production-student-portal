import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../lib/api';

export type Role = 'guardian' | 'staff' | 'admin' | 'student';

export interface User {
    name: string;
    role: Role;
    id: string;
    phoneNumber?: string;
    email?: string;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (identifier: string, password: string) => {
        try {
            const trimmed = identifier.trim();
            const payload: any = {
                identifier: trimmed,
                phoneNumber: trimmed,
                email: trimmed,
                password
            };
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

    // Load user from URL handoff params or local storage
    React.useEffect(() => {
        try {
            let token = localStorage.getItem('somobloom_token');
            let storedUser = localStorage.getItem('somobloom_user');

            // Parse URL parameters or hash fragment for handoff from landing page
            const searchParams = new URLSearchParams(window.location.search);
            const hashString = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
            const hashParams = new URLSearchParams(hashString);

            const handoffToken = searchParams.get('token') || hashParams.get('token');
            const handoffUser = searchParams.get('user') || hashParams.get('user');

            if (handoffToken) {
                token = handoffToken;
                localStorage.setItem('somobloom_token', handoffToken);
            }
            if (handoffUser) {
                storedUser = handoffUser;
                localStorage.setItem('somobloom_user', handoffUser);
            }

            if (handoffToken || handoffUser) {
                // Clean tokens from browser URL history for security
                const cleanUrl = window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            }

            if (storedUser && token) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.role === 'teacher') parsedUser.role = 'staff';
                if (parsedUser.role === 'parent') parsedUser.role = 'guardian';
                setUser(parsedUser);
                localStorage.setItem('somobloom_user', JSON.stringify(parsedUser));
            }
        } catch (e) {
            console.error('Failed to parse auth user/token from storage or URL:', e);
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
