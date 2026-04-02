import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/contact', formData);
            
            if (response.data.success) {
                setSuccess(true);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    message: ''
                });
                
                // Hide success message after 5 seconds
                setTimeout(() => setSuccess(false), 5000);
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to send message. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Get in Touch</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Have questions? We'd love to hear from you.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="space-y-8 col-span-1">
                    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Email Us</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">sachinkumarmth845401@gmail.com</p>
                            </div>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">We usually respond within 24 hours.</p>
                    </div>

                    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Call Us</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">+91 9934220802</p>
                            </div>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Mon-Fri from 9am to 6pm.</p>
                    </div>

                    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl text-primary-600 dark:text-primary-400">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Visit Us</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Lovely professional university <br /> Phagwara  Punjab  </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2 bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <p className="text-green-800 dark:text-green-300">Message sent successfully! We'll get back to you soon.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <p className="text-red-800 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</label>
                                <input 
                                    type="text" 
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="input-field dark:bg-dark-900 dark:border-dark-600 dark:text-white" 
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</label>
                                <input 
                                    type="text" 
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="input-field dark:bg-dark-900 dark:border-dark-600 dark:text-white" 
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address *</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field dark:bg-dark-900 dark:border-dark-600 dark:text-white" 
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message *</label>
                            <textarea 
                                rows="5" 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="input-field dark:bg-dark-900 dark:border-dark-600 dark:text-white" 
                                placeholder="Enter your message (minimum 10 characters)"
                                required
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" /> 
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
