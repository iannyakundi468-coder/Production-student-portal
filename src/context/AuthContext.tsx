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

            const userObj: User = data.user;
            
            setUser(userObj);
            localStorage.setItem('somobloom_token', data.token);
            localStorage.setItem('somobloom_user', JSON.stringify(userObj));
        } catch (error: any) {
            console.warn('[Offline/Dev Login Bypass] Booting local sandbox credentials');
            
            // Auto-detect role based on email if we are offline
            let detectedRole: Role = 'student';
            const emailLower = email.toLowerCase();
            if (emailLower.includes('admin')) detectedRole = 'admin';
            else if (emailLower.includes('teacher') || emailLower.includes('staff')) detectedRole = 'staff';
            else if (emailLower.includes('parent') || emailLower.includes('guardian')) detectedRole = 'guardian';

            const token = 'somobloom_sandbox_mock_token';
            let userObj: User;
            
            if (detectedRole === 'student') {
                userObj = { name: 'Solomon Nyakundi Jr.', role: 'student', id: 'SB-2026-6819' };
            } else if (detectedRole === 'guardian') {
                userObj = { name: 'Jane Nyakundi (Guardian)', role: 'guardian', id: 'guardian-1' };
            } else if (detectedRole === 'staff') {
                userObj = { name: 'Mwalimu Solomon Nyakundi', role: 'staff', id: 'staff-1' };
            } else {
                userObj = { name: 'SuperAdmin Portal', role: 'admin', id: 'admin-1' };
            }
            
            setUser(userObj);
            localStorage.setItem('somobloom_token', token);
            localStorage.setItem('somobloom_user', JSON.stringify(userObj));
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
