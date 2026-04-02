import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, BarChart2, MapPin, Clock } from 'lucide-react';

const HostDashboardPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHostEvents = async () => {
            try {
                const { data } = await api.get('/events/host/my-events');
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch host events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHostEvents();
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-400 font-medium">Loading Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-3 tracking-tight">Host Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your events, view analytics, and export guest lists.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-6 rounded-[2rem] shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Events Hosted</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{events.length}</p>
                    </div>
                </div>
            </div>

            {/* Event List */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Events</h2>
            
            {events.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[3rem]">
                    <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Events Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first event to start seeing analytics.</p>
                    <Link to="/admin" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all">Create Event</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <div key={event._id} className="group bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-500/20 transition-all duration-300 flex flex-col">
                            <div className="h-48 relative overflow-hidden bg-gray-100 dark:bg-dark-900">
                                {event.bannerImage ? (
                                    <img 
                                        src={event.bannerImage.startsWith('/uploads/') ? `http://localhost:5000${event.bannerImage}` : event.bannerImage}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm border border-white/20">
                                    {event.category}
                                </div>
                            </div>
                            
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">{event.title}</h3>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                                        <Calendar className="w-4 h-4 text-primary-500" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                                        <Clock className="w-4 h-4 text-primary-500" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                                        <MapPin className="w-4 h-4 text-primary-500" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Link 
                                        to={`/host-dashboard/${event._id}`} 
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-primary-50 dark:from-primary-900/20 dark:to-indigo-900/20 text-primary-700 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                                    >
                                        <BarChart2 className="w-4 h-4" /> View Analytics
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HostDashboardPage;
