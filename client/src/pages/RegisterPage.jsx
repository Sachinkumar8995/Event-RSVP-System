import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const { register, googleLogin, verifyOtp, resendOtp } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        const result = await register(name, email, password);
        if (result.success) {
            if (result.requiresOtp) {
                setStep(2);
                setSuccessMsg(result.message);
                toast.info(result.message);
            } else {
                toast.success('Account created successfully!');
                navigate('/');
            }
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        const result = await verifyOtp(email, otp);
        if (result.success) {
            toast.success('Email verified successfully!');
            navigate('/');
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    const handleResendOtp = async () => {
        setError(null);
        setSuccessMsg(null);
        const result = await resendOtp(email);
        if (result.success) {
            setSuccessMsg(result.message);
            toast.success(result.message);
        } else {
            setError(result.message);
            toast.error(result.message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError(null);
        const result = await googleLogin(credentialResponse.credential);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {step === 1 ? 'Create Account' : 'Verify Email'}
                </h2>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>}
                {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-6">{successMsg}</div>}

                {step === 1 ? (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                            <button type="submit" className="btn-primary w-full py-2.5">Sign Up</button>
                        </form>

                        <div className="mt-6 flex items-center justify-center">
                            <div className="border-t border-gray-300 flex-grow mr-3"></div>
                            <span className="text-sm text-gray-500">OR</span>
                            <div className="border-t border-gray-300 flex-grow ml-3"></div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Signup Failed')}
                            />
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
                        </p>
                    </>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <p className="text-sm text-gray-600 text-center mb-4">
                            We've sent a 6-digit OTP to <strong>{email}</strong>.
                        </p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                className="input-field text-center tracking-widest text-lg"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full py-2.5">Verify Account</button>
                        
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Didn't receive code? Resend
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
