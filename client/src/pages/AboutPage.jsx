import { Users, Globe, Award, Target, Heart, Zap } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="space-y-20 py-12">
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto space-y-8 px-4">
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
                    Connecting People Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">Unforgettable Events</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                    At EventHub, we believe that life is better when we come together. Our mission is to make it effortless for you to discover, host, and manage events that create lasting memories.
                </p>
            </section>

            {/* Our Story Section */}
            <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 relative h-96 rounded-3xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                        alt="Team collaborating"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
                <div className="space-y-6 order-1 md:order-2">
                    <div className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider text-sm bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                        <Globe className="w-4 h-4" /> Our Story
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">A Personal Passion Project</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        It all started as a personal endeavor to build a comprehensive online RSVP event website. Driven by a passion for modern web technologies like Node.js and React.js, I set out to create a platform that makes event management seamless and intuitive.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        EventHub is the culmination of countless hours of coding, designing, and problem-solving. This project stands as a testament to my dedication to crafting high-quality, practical web applications from the ground up, entirely as a solo developer.
                    </p>
                </div>
            </section>

            {/* Stats Section with icons */}
            <section className="bg-gray-900 text-white py-16 rounded-3xl">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="space-y-2 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <CalendarIcon className="w-8 h-8 mx-auto text-primary-400 mb-2" />
                        <div className="text-4xl font-bold">10k+</div>
                        <div className="text-gray-400 font-medium">Events Hosted</div>
                    </div>
                    <div className="space-y-2 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <UsersIcon className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                        <div className="text-4xl font-bold">50k+</div>
                        <div className="text-gray-400 font-medium">Active Users</div>
                    </div>
                    <div className="space-y-2 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <MapIcon className="w-8 h-8 mx-auto text-green-400 mb-2" />
                        <div className="text-4xl font-bold">100+</div>
                        <div className="text-gray-400 font-medium">Cities</div>
                    </div>
                    <div className="space-y-2 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <StarIcon className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                        <div className="text-4xl font-bold">4.9/5</div>
                        <div className="text-gray-400 font-medium">User Rating</div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="max-w-7xl mx-auto px-4 text-center space-y-12">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Our Core Values</h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">The principles that guide every decision we make.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6 mx-auto">
                            <Heart className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Community First</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            We build for people. Every feature is designed to foster genuine connections and meaningful interactions.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 mx-auto">
                            <Target className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Trust & Safety</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your safety is our priority. We verify organizers and provide robust tools to ensure secure gatherings.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-700 hover:-translate-y-1 transition-transform">
                        <div className="w-14 h-14 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-6 mx-auto">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Innovation</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            We are constantly pushing boundaries to make event management smarter, faster, and more intuitive.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-gray-50 dark:bg-dark-800 py-16 rounded-3xl">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Meet the Developer</h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">The passionate mind behind EventHub.</p>
                    </div>

                    <div className="max-w-md mx-auto">
                        {/* Sachin Kumar */}
                        <div className="bg-white dark:bg-dark-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-dark-700">
                            <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-gray-200 dark:bg-dark-800">
                                <img src="/sachin.jpg" alt="Sachin Kumar" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sachin Kumar</h3>
                            <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">Creator & Full Stack Developer</p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-left">
                                I am a dedicated Full Stack Developer with a strong focus on building scalable, user-centric web applications. EventHub is my solo personal project, designed from the ground up to demonstrate my expertise in React, Node.js, and modern web architecture. I am passionate about clean code, intuitive UI/UX, and solving real-world problems through technology.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Simple icon wrappers to avoid import errors if not using a set
const CalendarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);
const MapIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const UsersIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const StarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

export default AboutPage;
