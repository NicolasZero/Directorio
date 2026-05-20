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
    logout: () => Promise<void>;
    login: (user: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [status, setStatus] = useState<Status>('checking');
    const [user, setUser] = useState<User | null>(null);
    // const [date,setDate] = useState(new Date)

    const refreshSession = async () => {
        const refreshResp = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
        });

        if (!refreshResp.ok) {
            throw new Error('No se pudo refrescar la sesión');
        }

        const data = await refreshResp.json();
        if (data.error) {
            throw new Error(data.error);
        }

        setUser(data.data);
        setStatus('authenticated');
        localStorage.setItem('directorio_logged_in', 'true');
    };

    useEffect(() => {
        const checkToken = async () => {
            if (localStorage.getItem('directorio_logged_in') !== 'true') {
                setStatus('no-authenticated');
                return;
            }

            let shouldRefresh = false;

            try {
                const resp = await fetch('/api/auth/validate', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (resp.ok) {
                    const data = await resp.json();
                    setUser(data.data);
                    setStatus('authenticated');
                    localStorage.setItem('directorio_logged_in', 'true');
                    return;
                }

                // Si es 401, marcamos para intentar refrescar
                if (resp.status === 401) {
                    shouldRefresh = true;
                } else {
                    setStatus('no-authenticated');
                    localStorage.removeItem('directorio_logged_in');
                }

            } catch {
                // Si hay un error de red u otro problema al validar, también intentamos refrescar
                shouldRefresh = true;
            }

            if (shouldRefresh) {
                try {
                    await refreshSession();
                } catch {
                    setStatus('no-authenticated');
                    localStorage.removeItem('directorio_logged_in');
                }
            }
        };

        checkToken();
    }, []);

    const logout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al cerrar sesión');
            }
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            setUser(null);
            setStatus('no-authenticated');
            localStorage.removeItem('directorio_logged_in');
        }
    };

    const login = async (user: string, pass: string) => {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, pass }),
            })
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setUser(data.data);
            setStatus('authenticated');
            localStorage.setItem('directorio_logged_in', 'true');
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