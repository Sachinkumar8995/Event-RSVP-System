import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    AreaChart, Area
} from 'recharts';
import { Users, Calendar, BarChart3 } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#3b82f6'];
const STATUS_COLORS = {
    'Going': '#10b981', // green-500
    'Maybe': '#f59e0b', // amber-500
    'Not Going': '#ef4444' // red-500
};

const AnalyticsTab = ({ events, users, eventRSVPCounts }) => {
    // 1. Calculate Events by Category
    const categoryData = useMemo(() => {
        const counts = {};
        events.forEach(event => {
            const cat = event.category || 'Other';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [events]);

    // 2. Calculate RSVP Status Distribution over ALL events
    const rsvpStatusData = useMemo(() => {
        let going = 0, maybe = 0, notGoing = 0;
        
        Object.values(eventRSVPCounts).forEach(counts => {
            going += (counts.going || 0);
            maybe += (counts.maybe || 0);
            notGoing += (counts.not_going || 0);
        });

        return [
            { name: 'Going', value: going },
            { name: 'Maybe', value: maybe },
            { name: 'Not Going', value: notGoing }
        ].filter(item => item.value > 0); // Hide empty slices
    }, [eventRSVPCounts]);

    // 3. Calculate Events per Month
    const eventsPerMonth = useMemo(() => {
        const months = {};
        
        events.forEach(event => {
            if (!event.date) return;
            const date = new Date(event.date);
            // Format to "Mon YYYY" (e.g. "Oct 2023")
            const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            months[monthYear] = (months[monthYear] || 0) + 1;
        });

        // Convert to array and sort chronologically
        const sortedArray = Object.entries(months).map(([month, count]) => {
            const [m, y] = month.split(' ');
            return { month, count, _rawSortDate: new Date(`${month} 1`).getTime() };
        }).sort((a, b) => a._rawSortDate - b._rawSortDate);

        return sortedArray.map(({ month, count }) => ({ month, Events: count }));
    }, [events]);

    // Quick Stats
    const totalRSVPs = useMemo(() => {
        return Object.values(eventRSVPCounts).reduce((sum, current) => sum + (current.total || 0), 0);
    }, [eventRSVPCounts]);


    return (
        <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Events</p>
                        <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-green-50 text-green-600">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
                        <BarChart3 className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total RSVPs</p>
                        <p className="text-2xl font-bold text-gray-900">{totalRSVPs}</p>
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Events by Category - Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Events by Category</h3>
                    {categoryData.length > 0 ? (
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        angle={-45}
                                        textAnchor="end"
                                    />
                                    <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip 
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" name="Events" radius={[6, 6, 0, 0]}>
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-gray-400">No events data available</div>
                    )}
                </div>

                {/* RSVP Status - Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Overall RSVP Status</h3>
                    {rsvpStatusData.length > 0 ? (
                        <div className="h-72 w-full flex flex-col">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={rsvpStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {rsvpStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-6 mt-4 pb-2">
                                {rsvpStatusData.map(entry => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name] }}></div>
                                        <span className="text-sm font-medium text-gray-600">{entry.name} ({entry.value})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-gray-400">No RSVP data available</div>
                    )}
                </div>

                {/* Events Over Time - Area Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Events Distribution Over Time</h3>
                    {eventsPerMonth.length > 0 ? (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={eventsPerMonth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="month" 
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="Events" 
                                        stroke="#6366f1" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorEvents)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-gray-400">No date data available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
