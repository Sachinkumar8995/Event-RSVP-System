import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Download, Users, DollarSign, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { toast } from 'react-toastify';

const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Going (Green), Maybe (Yellow), Not Going (Red)

const HostEventAnalyticsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get(`/events/host/${id}/stats`);
                setEventData(data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
                toast.error("Failed to load analytics or unauthorized.");
                navigate('/host-dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [id, navigate]);

    const handleExportCSV = () => {
        if (!eventData || !eventData.attendees) return;

        const headers = ['Name', 'Email', 'RSVP Status', 'Payment Status', 'Date RSVPd'];
        const csvRows = [headers.join(',')];

        eventData.attendees.forEach(attendee => {
            const name = `"${attendee.user?.name || 'N/A'}"`;
            const email = `"${attendee.user?.email || 'N/A'}"`;
            const status = attendee.status;
            const payment = attendee.paymentStatus;
            const date = new Date(attendee.date).toLocaleDateString();

            csvRows.push([name, email, status, payment, date].join(','));
        });

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${eventData.event.title.replace(/\s+/g, '_')}_Attendees.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="text-center py-20 text-gray-400 font-medium">Loading Analytics...</div>;
    if (!eventData) return null;

    const { event, stats, attendees } = eventData;

    // Formatting data for Pie Chart
    const pieData = [
        { name: 'Going', value: stats.statusCounts.going },
        { name: 'Maybe', value: stats.statusCounts.maybe },
        { name: 'Not Going', value: stats.statusCounts.not_going }
    ].filter(entry => entry.value > 0);

    // Transforming dates for Line Chart (RSVPs over time)
    const datesMap = {};
    attendees.forEach(a => {
        const dateStr = new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        datesMap[dateStr] = (datesMap[dateStr] || 0) + 1;
    });
    
    // Sort chronologically (assuming dates are generally sequential in the map due to JS string hashing, but actually needs sorting)
    const lineData = Object.keys(datesMap).map(date => ({
        date,
        RSVPs: datesMap[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>

            <button 
                onClick={() => navigate('/host-dashboard')} 
                className="flex items-center gap-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 mb-6 font-medium transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{event.title} <span className="text-primary-500 font-light">Analytics</span></h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Insights and attendee management for your event.</p>
                </div>
                <button 
                    onClick={handleExportCSV}
                    className="flexItems-center justify-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary-500 dark:hover:border-primary-500 text-gray-900 dark:text-white rounded-xl shadow-sm hover:shadow-md transition-all group font-bold"
                >
                    <Download className="w-5 h-5 text-primary-500 group-hover:-translate-y-1 transition-transform" />
                    Export Guest List (.csv)
                </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-6 rounded-[2rem] shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total RSVPs</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalRSVPs}</p>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-6 rounded-[2rem] shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Going / Confirmed</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.statusCounts.going}</p>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 p-6 rounded-[2rem] shadow-sm flex items-center gap-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 blur-2xl rounded-full"></div>
                    <div className="w-14 h-14 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">₹{stats.totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* RSVP Status Pie Chart */}
                <div className="bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 p-8 rounded-[2rem] shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">RSVP Demographics</h3>
                    <div className="h-72 w-full">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No data available</div>
                        )}
                    </div>
                </div>

                {/* RSVPs Over Time Line Chart */}
                <div className="bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 p-8 rounded-[2rem] shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">RSVPs Over Time</h3>
                    <div className="h-72 w-full">
                        {lineData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <Line type="monotone" dataKey="RSVPs" stroke="#6366f1" strokeWidth={4} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 8 }} />
                                    <CartesianGrid stroke="#f3f4f6" strokeDasharray="5 5" vertical={false} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400">Not enough data to graph</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Attendee Data Table */}
            <div className="bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center bg-gray-50/50 dark:bg-dark-800/50">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Attendee List</h3>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-dark-700 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-600">
                        {attendees.length} Guests
                    </span>
                </div>
                
                <div className="overflow-x-auto p-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-dark-700">Name</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-dark-700">Email</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-dark-700">RSVP Status</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-dark-700">Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                            {attendees.map((attendee) => (
                                <tr key={attendee.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-700/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                            {attendee.user?.profileImage ? (
                                                <img src={attendee.user.profileImage.startsWith('/uploads') ? `http://localhost:5000${attendee.user.profileImage}` : attendee.user.profileImage} 
                                                     alt="avatar" className="w-8 h-8 rounded-full object-cover shadow-sm bg-gray-100" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 text-xs font-bold">
                                                    {(attendee.user?.name || 'U').charAt(0)}
                                                </div>
                                            )}
                                            {attendee.user?.name || 'Unknown User'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        {attendee.user?.email || 'No email provided'}
                                    </td>
                                    <td className="p-4">
                                        {attendee.status === 'going' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">Going</span>}
                                        {attendee.status === 'maybe' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">Maybe</span>}
                                        {attendee.status === 'not_going' && <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">Not Going</span>}
                                    </td>
                                    <td className="p-4">
                                        {event.price > 0 ? (
                                             attendee.paymentStatus === 'completed' 
                                                ? <span className="px-2 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 rounded text-xs font-bold border border-green-200 dark:border-green-500/20">Paid</span>
                                                : <span className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-500 rounded text-xs font-bold border border-gray-200 dark:border-dark-600">Pending</span>
                                        ) : (
                                            <span className="text-gray-400 text-sm font-medium">Free</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {attendees.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium">
                                        No one has RSVP'd yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    );
};

export default HostEventAnalyticsPage;
