import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Calendar, User, Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/explore' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    if (user) {
        navLinks.push({ name: 'My RSVPs', path: '/my-rsvps' });
        navLinks.push({ name: 'Host Dashboard 📊', path: '/host-dashboard' });
        if (user.isAdmin) {
            navLinks.push({ name: 'Admin', path: '/admin' });
        }
    }

    return (
        <nav 
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled 
                ? 'bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-dark-800/50 shadow-sm' 
                : 'bg-white dark:bg-dark-900 border-b border-transparent dark:border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Brand / Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-xl group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                                <Calendar className="w-7 h-7 text-primary-600 dark:text-primary-500 transform group-hover:-rotate-12 transition-transform duration-300" />
                            </div>
                            <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                EventRSVP
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link 
                                    key={link.name} 
                                    to={link.path} 
                                    className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-300 group
                                        ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'}
                                    `}
                                >
                                    {link.name}
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 transform origin-left transition-transform duration-300 ease-out
                                        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                                    `}></span>
                                </Link>
                            )
                        })}

                        {/* Theme Toggle */}
                        <div className="pl-4 border-l border-gray-200 dark:border-dark-800 pr-2">
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-dark-800 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
                                aria-label="Toggle Dark Mode"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* User Actions */}
                        <div className="flex items-center gap-3 pl-2">
                            {user ? (
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-dark-800 px-4 py-1.5 rounded-full border border-gray-100 dark:border-dark-700">
                                    <Link to="/profile" className="flex items-center gap-2 group cursor-pointer">
                                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-primary-100 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800">
                                            {user.profileImage ? (
                                                <img 
                                                    src={user.profileImage.startsWith('http') ? user.profileImage : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? `http://localhost:5000${user.profileImage}` : user.profileImage)} 
                                                    alt={user.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {user.name.split(' ')[0]}
                                        </span>
                                    </Link>
                                    <div className="w-px h-5 bg-gray-300 dark:bg-dark-600"></div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                                        title="Logout"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                        Log in
                                    </Link>
                                    <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300">
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-50 dark:bg-dark-800 text-gray-600 dark:text-gray-300"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2"
                        >
                            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors
                                    ${location.pathname === link.path 
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'}
                                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-dark-800">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-4">
                                        <div className="bg-primary-100 dark:bg-primary-900/50 p-2 rounded-full">
                                            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Signed in as</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 mt-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-semibold transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 px-2">
                                    <Link to="/login" className="flex justify-center items-center py-3 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                        Log in
                                    </Link>
                                    <Link to="/register" className="flex justify-center items-center py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 shadow-md transition-colors">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
