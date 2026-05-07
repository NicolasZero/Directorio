import { createContext, useContext, useEffect, useState } from 'react';

type Status = 'checking' | 'authenticated' | 'no-authenticated';

interface User {
    id: number;
    username: string;
    nombre: string;
    email: string;
    role: string;
}

interface AuthContextType {
    status: Status;
    user: User | null;
    logout: () => void;
    login: (user: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [status, setStatus] = useState<Status>('checking');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Al cargar la app, verificamos si hay un token válido
        const checkToken = async () => {
            try {
                const resp = await fetch('/api/auth/validate');
                if (resp.ok) {
                    const data = await resp.json();
                    setUser(data.data);
                    setStatus('authenticated');
                } else {
                    setStatus('no-authenticated');
                }
            } catch {
                setStatus('no-authenticated');
            }
        };

        checkToken();
    }, []);

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
            // Ignore errors on logout
        }
        setUser(null);
        setStatus('no-authenticated');
    };

    const login = async (user: string, pass: string) => {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, pass }),
            })
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setUser(data.data);
            setStatus('authenticated');
        } catch {
            throw new Error('Usuario o contraseña incorrectos');
        }
    };

    return (
        <AuthContext.Provider value={{ status, user, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);