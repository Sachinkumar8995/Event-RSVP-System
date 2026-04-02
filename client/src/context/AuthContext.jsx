import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', {
                email,
                password,
            });
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', {
                name,
                email,
                password,
            });
            if (data.requiresOtp) {
                return { success: true, requiresOtp: true, message: data.message };
            }
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            setUser(data);
            return { success: true, message: 'Verification successful!' };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'OTP verification failed'
            };
        }
    };

    const resendOtp = async (email) => {
        try {
            const { data } = await api.post('/auth/resend-otp', { email });
            return { success: true, message: data.message };
        } catch (error) {
             return {
                success: false,
                message: error.response?.data?.message || 'Failed to resend OTP'
            };
        }
    };

    const googleLogin = async (token) => {
        try {
            const { data } = await api.post('/auth/google', { token });
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Google Auth failed'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const updateUser = (updatedUser) => {
        setUser({ ...user, ...updatedUser });
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading, verifyOtp, resendOtp, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
