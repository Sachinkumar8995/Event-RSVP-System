import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Clock, Search, Filter, X, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

const ExplorePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read initial states from URL so direct links work correctly
    const initPage = Number(searchParams.get('page')) || 1;
    const initCategory = searchParams.get('category') || 'All';
    const initSearch = searchParams.get('search') || '';

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(initSearch);
    const [selectedCategory, setSelectedCategory] = useState(initCategory);
    
    const [page, setPage] = useState(initPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);

    const timerRef = useRef(null);
    const isFirstRender = useRef(true);

    const categories = [
        'All',
        'Music & Concerts',
        'Tech & Workshops',
        'Food & Drink',
        'Arts & Culture',
        'Sports & Fitness',
        'Business',
        'Networking',
        'Charity'
    ];

    const fetchEvents = async (currentPage, currentCategory, currentSearch) => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            query.append('page', currentPage);
            query.append('limit', 9); // limit to 9 so it makes a 3x3 grid on desktop
            if (currentSearch) query.append('search', currentSearch);
            if (currentCategory !== 'All') query.append('category', currentCategory);

            // Sync URL params
            const newParams = new URLSearchParams();
            if (currentSearch) newParams.set('search', currentSearch);
            if (currentCategory !== 'All') newParams.set('category', currentCategory);
            if (currentPage > 1) newParams.set('page', currentPage);
            setSearchParams(newParams, { replace: true });

            const { data } = await api.get(`/events?${query.toString()}`);
            
            setEvents(data.events || []);
            setTotalPages(data.pages || 1);
            setTotalEvents(data.total || 0);
        } catch (error) {
            console.error('Failed to load events', error);
        } finally {
            setTimeout(() => setLoading(false), 200);
        }
    };

    // On mount
    useEffect(() => {
        fetchEvents(page, selectedCategory, searchTerm);
        // eslint-disable-next-line
    }, []);

    // When filters or page change, fetch with debounce
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            fetchEvents(page, selectedCategory, searchTerm);
        }, 300); 

        return () => clearTimeout(timerRef.current);
        // eslint-disable-next-line
    }, [searchTerm, selectedCategory, page]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 dark:border-dark-800 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Events</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {totalEvents > 0 ? `Showing ${events.length} of ${totalEvents} events` : "Discover what's happening around you"}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full md:w-auto relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search events, locations..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full md:w-80 bg-white dark:bg-dark-800 text-gray-900 dark:text-white transition-colors"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setPage(1);
                            }}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <Tag className="w-5 h-5 text-gray-400 flex-shrink-0" />
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid Area with robust loading overlay */}
            <div className="relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-dark-900/50 backdrop-blur-sm rounded-2xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                )}

                {!loading && events.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-xl border border-dashed border-gray-200 dark:border-dark-700">
                        <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No events found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search terms or category</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <Link key={event._id} to={`/events/${event._id}`} className="group relative block h-full">
                                <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-dark-700 h-full flex flex-col hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                    <div className="h-48 bg-gray-200 dark:bg-dark-700 relative overflow-hidden">
                                        <img
                                            src={event.bannerImage 
                                                ? (event.bannerImage.startsWith('/uploads/') ? `http://localhost:5000${event.bannerImage}` : event.bannerImage)
                                                : `https://images.unsplash.com/photo-${event._id.charCodeAt(0) % 2 === 0 ? '1492684223066-81342ee5ff30' : '1501281668745-13bc6a60fe3d'}?auto=format&fit=crop&w=800&q=80`
                                            }
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 dark:text-primary-400 shadow-sm w-fit">
                                                {event.date}
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm w-fit ${
                                                event.price > 0 
                                                    ? 'bg-primary-600 text-white' 
                                                    : 'bg-green-500 text-white'
                                            }`}>
                                                {event.price > 0 ? `₹${event.price}` : 'FREE'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-grow">{event.description}</p>
                                        <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-dark-700 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
                            page === 1 
                                ? 'bg-gray-50 dark:bg-dark-800 border-gray-200 dark:border-dark-700 text-gray-400 cursor-not-allowed'
                                : 'bg-white dark:bg-dark-800 border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                        }`}
                        aria-label="Previous Page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1 mx-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors border ${
                                    page === i + 1
                                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                                        : 'bg-white dark:bg-dark-800 border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className={`p-2 rounded-lg border transition-colors flex items-center justify-center ${
                            page === totalPages 
                                ? 'bg-gray-50 dark:bg-dark-800 border-gray-200 dark:border-dark-700 text-gray-400 cursor-not-allowed'
                                : 'bg-white dark:bg-dark-800 border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                        }`}
                        aria-label="Next Page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExplorePage;
