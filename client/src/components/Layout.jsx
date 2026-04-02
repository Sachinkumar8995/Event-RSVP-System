import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col transition-colors duration-200">
            <Navbar />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <footer className="bg-white dark:bg-dark-900 border-t border-gray-100 dark:border-dark-800 py-6 mt-auto transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">EventHub</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Connecting people with the best local events and communities since 2024. Your next memory starts here.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Browse Events</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Create Event</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="http://localhost:5173/about" className="hover:text-primary-600 dark:hover:text-primary-400">About Us</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Careers</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 dark:text-gray-500 text-sm pt-8 border-t border-gray-100 dark:border-dark-800">
                    &copy; {new Date().getFullYear()} EventHub. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
