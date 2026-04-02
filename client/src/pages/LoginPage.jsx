import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        const result = await login(email, password);
        if (result.success) {
            toast.success('Logged in successfully!');
            navigate('/');
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError(null);
        setSuccessMsg(null);
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
            toast.success('Google Login Successful!');
            navigate('/');
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>}
                {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-6">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full py-2.5">Sign In</button>
                </form>

                <div className="mt-6 flex items-center justify-center">
                    <div className="border-t border-gray-300 flex-grow mr-3"></div>
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="border-t border-gray-300 flex-grow ml-3"></div>
                </div>

                <div className="mt-6 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login Failed')}
                    />
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Create account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
