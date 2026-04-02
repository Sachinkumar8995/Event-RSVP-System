import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Shield, LogOut, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const ProfilePage = () => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await api.post('/upload/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Update the user context with the new profile image URL
            updateUser({ profileImage: data.imageUrl });
            toast.success('Profile image updated successfully!');
        } catch (error) {
            console.error('Error uploading image', error);
            toast.error(error.response?.data?.message || 'Failed to upload image. Must be < 5MB and a valid image format.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Full URL to profile image (assuming local backend running on port 5000)
    const getProfileImageUrl = () => {
        if (!user.profileImage) return null;
        if (user.profileImage.startsWith('http')) return user.profileImage;
        // In local dev, prepend backend URL for older local uploads
        const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        return isLocalDev ? `http://localhost:5000${user.profileImage}` : user.profileImage;
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                        {/* Profile Image Wrapper */}
                        <div className="relative group">
                            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 overflow-hidden border-4 border-white shadow-sm transition-all group-hover:border-primary-100">
                                {uploading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                ) : user.profileImage ? (
                                    <img 
                                        src={getProfileImageUrl()} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12" />
                                )}
                            </div>
                            
                            {/* Upload overlay */}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200" title="Change Profile Picture">
                                <Camera className="w-8 h-8 text-white" />
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500">Member since {new Date().getFullYear()}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 mb-0.5">Email Address</p>
                                <p className="font-medium text-gray-900">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <Shield className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 mb-0.5">Account Role</p>
                                <p className="font-medium text-gray-900">
                                    {user.isAdmin ? 'Administrator' : 'Standard User'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
