import { createContext, useContext, useState, type ReactNode } from 'react';

interface SettingsContextType {
    aiEnabled: boolean;
    setAiEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    // Default to true for demonstration, or load from localStorage
    const [aiEnabled, setAiEnabled] = useState<boolean>(true);

    return (
        <SettingsContext.Provider value={{ aiEnabled, setAiEnabled }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
