import { Link } from 'react-router-dom';
import { Sparkles, Users, Calendar } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative bg-white dark:bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-gray-900 py-24 px-8 md:px-16 text-center md:text-left isolate transition-colors">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1511795409835-a96041b6a058?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                {/* Gradient for text visibility - changes in dark mode */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-dark-900 dark:via-dark-900/90 dark:to-transparent/50"></div>

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight dark:text-white">
                        Connect, Celebrate, <br />
                        <span className="text-primary-600 dark:text-primary-400">Create Memories</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-medium">
                        EventHub is your ultimate platform for discovering local gatherings, tech meetups, and social parties. Manage your RSVPs effortlessly and never miss out on the fun again.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                        <Link to="/explore" className="btn bg-primary-600 text-white hover:bg-primary-700 font-bold py-4 px-10 rounded-xl shadow-lg transition-all hover:-translate-y-1 text-lg">
                            Explore Events
                        </Link>
                        <Link to="/" className="btn bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-600 border-2 border-primary-100 dark:border-dark-600 font-bold py-4 px-10 rounded-xl shadow-md transition-all hover:-translate-y-1 text-lg">
                            Join Community
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="text-center space-y-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How EventHub Works</h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400">Your journey to amazing experiences in 3 simple steps</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="relative p-8 rounded-2xl bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Discover</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            Browse through hundreds of local events tailored to your interests. From workshops to concerts, find what moves you.
                        </p>
                    </div>
                    <div className="relative p-8 rounded-2xl bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Book</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            RSVP with a single click. No complicated forms. Secure your spot instantly and get confirmation sent to your inbox.
                        </p>
                    </div>
                    <div className="relative p-8 rounded-2xl bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 mx-auto group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Connect</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            Show up and have fun! Network with like-minded people, create memories, and share your experience with the community.
                        </p>
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="space-y-10">
                <div className="text-center md:text-left flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Explore by Category</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Find events that match your passion</p>
                    </div>
                    <Link to="/explore" className="hidden md:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:gap-3 transition-all">
                        View All Categories <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: 'Music & Concerts', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Tech & Workshops', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Food & Drink', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Arts & Culture', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Sports & Fitness', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Business', img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Networking', img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80' },
                        { name: 'Charity', img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80' }
                    ].map((category, idx) => (
                        <Link key={idx} to={`/explore?category=${encodeURIComponent(category.name)}`} className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm hover:shadow-lg hover:border-primary-100 transition-all text-center group">
                            <div className="w-full h-32 rounded-xl bg-gray-50 dark:bg-dark-700 mb-4 overflow-hidden relative">
                                <img
                                    src={category.img}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-primary-50 dark:bg-dark-800 rounded-3xl p-8 md:p-16 my-16 border border-transparent dark:border-dark-700">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Why thousands choose EventHub</h2>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="bg-white dark:bg-dark-700 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-dark-600 h-fit">
                                    <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vibrant Community</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Join a growing network of organizers and attendees who share your interests.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white dark:bg-dark-700 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-dark-600 h-fit">
                                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Unforgettable Experiences</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Access exclusive events and premium gatherings you won't find anywhere else.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white dark:bg-dark-700 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-dark-600 h-fit">
                                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Seamless Booking</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Our smart booking system ensures you never lose your spot or miss a payment.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-dark-700">
                        <img
                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                            alt="Event crowd"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gradient-to-br from-gray-900 to-primary-900 rounded-3xl p-12 md:p-20 text-center text-white space-y-12">
                <h2 className="text-3xl md:text-4xl font-bold">What Our Community Says</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-left">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-lg italic mb-6">"EventHub completely changed how I find things to do on weekends. The RSVP process is so smooth!"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
                            <div>
                                <div className="font-bold">Sarah Jenkins</div>
                                <div className="text-sm text-gray-300">Tech Enthusiast</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-left">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-lg italic mb-6">"As an organizer, I love the admin tools. Seeing who is coming in real-time makes planning 10x easier."</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                            <div>
                                <div className="font-bold">David Chen</div>
                                <div className="text-sm text-gray-300">Community Manager</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-left">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-lg italic mb-6">"I moved to a new city and used EventHub to find hiking groups. Made my best friends through this app!"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                            <div>
                                <div className="font-bold">Emily Rossi</div>
                                <div className="text-sm text-gray-300">Outdoor Explorer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-primary-50 dark:bg-dark-800 rounded-3xl p-8 md:p-12 text-center border border-transparent dark:border-dark-700">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Stay Updated</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Subscribe to our newsletter to get weekly updates on the hottest events and exclusive community gatherings.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-xl border-gray-200 dark:border-dark-600 dark:bg-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm placeholder-gray-400"
                        />
                        <button type="submit" className="btn-primary py-4 px-8 rounded-xl whitespace-nowrap shadow-md hover:shadow-lg transition-all">
                            Subscribe
                        </button>
                    </form>
                    <p className="text-sm text-gray-400 dark:text-gray-500">No spam, unsubscribe anytime.</p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
