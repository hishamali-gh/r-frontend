import { createContext, useState, useEffect } from 'react';
import API from '../api.jsx'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('access');
    
            if (!token) {
                setLoading(false);
    
                return;
            }
    
            try {
                const res = await API.get('acc/me/');
    
                setUser(res.data);
            }
    
            catch (err) {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            }

            finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            { children }
        </AuthContext.Provider>
    )
}
