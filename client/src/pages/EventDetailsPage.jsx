import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Clock, ArrowLeft, CheckCircle, XCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { generateGoogleCalendarLink } from '../utils/calendarUtils';
import CommentSection from '../components/CommentSection';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rsvpStatus, setRsvpStatus] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paying, setPaying] = useState(false);
    const [deadlineStatus, setDeadlineStatus] = useState(null);
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);

                if (user) {
                    const myRsvps = await api.get('/rsvp/my');
                    const existing = myRsvps.data.find(r => r.event._id === id);
                    if (existing) {
                        setRsvpStatus(existing.status);
                        setPaymentStatus(existing.paymentStatus);
                    }
                }
                
                if (data.registrationDeadline) {
                    const deadlineDate = startOfDay(parseISO(data.registrationDeadline));
                    const today = startOfDay(new Date());
                    const diff = differenceInDays(deadlineDate, today);
                    
                    if (diff < 0) {
                        setDeadlineStatus('closed');
                    } else if (diff === 0) {
                        setDeadlineStatus('last_day');
                    } else {
                        setDeadlineStatus('open');
                        setDaysLeft(diff);
                    }
                }
            } catch (error) {
                console.error('Error loading event', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, user]);

    const handleRSVP = async (status) => {
        if (!user) return navigate('/login');

        if (status === 'going' && event.price > 0 && paymentStatus !== 'completed') {
            handlePayment();
            return;
        }

        try {
            await api.post('/rsvp', { eventId: id, status });
            setRsvpStatus(status);
            toast.success(`RSVP Updated: ${status.replace('_', ' ')}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed');
        }
    };

    const handlePayment = async () => {
        setPaying(true);
        try {
            const { data } = await api.post('/payments/create-checkout-session', { eventId: id });
            
            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: data.currency,
                name: "Event RSVP System",
                description: `Payment for ${event.title}`,
                order_id: data.id,
                handler: async function (response) {
                    try {
                        toast.info("Verifying payment...");
                        await api.post('/payments/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        setRsvpStatus('going');
                        setPaymentStatus('completed');
                        toast.success("Payment successful! RSVP confirmed.");
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Payment verification failed");
                    }
                },
                theme: {
                    color: "#3B82F6"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                toast.error(response.error.description || "Payment failed. Please try again.");
            });
            rzp.open();

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
        } finally {
            setPaying(false);
        }
    };

    if (loading) return <div className="text-center text-gray-400 py-20">Loading...</div>;
    if (!event) return <div className="text-center text-gray-400 py-20">Event not found</div>;

    return (
        <div className="relative max-w-5xl mx-auto px-4">

            {/* Glow Background */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full"></div>

            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-primary-400 mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {/* Main Card */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 
                rounded-3xl shadow-xl overflow-hidden">

                {/* Banner */}
                {event.bannerImage && (
                    <div className="h-72 w-full">
                        <img
                            src={event.bannerImage.startsWith('/uploads/')
                                ? `http://localhost:5000${event.bannerImage}`
                                : event.bannerImage}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-8">

                    {/* Title */}
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {event.title}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 flex gap-2 mt-2">
                                <MapPin size={16} /> {event.location}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 px-4 py-3 
                            bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl text-gray-200">

                            <Calendar size={18} />
                            {event.date}
                            <Clock size={18} />
                            {event.time}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex gap-4 mb-8 p-5 
                        bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg">

                        <div className="px-4 py-2 bg-white/10 rounded-lg text-white font-bold text-xl">
                            {event.price > 0 ? `₹${event.price}` : 'Free'}
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 uppercase">Price per person</p>
                            <p className="text-gray-300 text-sm">
                                {event.price > 0 ? 'Pay via Stripe to join.' : 'Open for everyone'}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-10">
                        <h3 className="text-lg font-semibold text-white mb-2">About this event</h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {event.description}
                        </p>
                    </div>

                    {/* Registration Deadline Banner */}
                    {event.registrationDeadline && deadlineStatus && (
                        <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 font-bold shadow-lg
                            ${deadlineStatus === 'closed' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400' : 
                              deadlineStatus === 'last_day' ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 
                              'bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/20 text-primary-600 dark:text-primary-400'}`}>
                            <Clock size={20} />
                            {deadlineStatus === 'closed' ? 'Registration is Closed' :
                             deadlineStatus === 'last_day' ? 'Last Day to Register!' :
                             `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left to register (Deadline: ${event.registrationDeadline})`}
                        </div>
                    )}

                    {/* RSVP */}
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-6">

                        <div>
                            <p className="text-xs text-gray-400 uppercase mb-3">Your RSVP</p>

                            <div className="flex flex-wrap gap-4">
                                {deadlineStatus === 'closed' ? (
                                    <div className="px-6 py-3 rounded-xl font-bold bg-white/5 text-gray-500 border border-white/10 w-full md:w-auto text-center">
                                        Registration Closed
                                    </div>
                                ) : (
                                  <>
                                    <button
                                        onClick={() => handleRSVP('going')}
                                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 
                                        ${rsvpStatus === 'going'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                                >
                                    <CheckCircle size={18} />
                                    {paying ? 'Redirecting...' : (event.price > 0 && paymentStatus !== 'completed' ? 'Pay & RSVP' : 'Going')}
                                </button>

                                <button
                                    onClick={() => handleRSVP('maybe')}
                                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 
                                        ${rsvpStatus === 'maybe'
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                                >
                                    <HelpCircle size={18} /> Maybe
                                </button>

                                <button
                                    onClick={() => handleRSVP('not_going')}
                                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 
                                        ${rsvpStatus === 'not_going'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                                >
                                    <XCircle size={18} /> Not Going
                                </button>
                                  </>
                                )}
                            </div>
                        </div>

                        {/* Calendar */}
                        {rsvpStatus === 'going' && (
                            <a
                                href={generateGoogleCalendarLink(event)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 
                                bg-gradient-to-r from-primary-500 to-blue-600 
                                text-white rounded-xl shadow-lg hover:scale-105 transition"
                            >
                                <ExternalLink size={16} />
                                Add to Google Calendar
                            </a>
                        )}
                    </div>
                </div>

                {/* Comments */}
                <CommentSection eventId={id} />
            </div>
        </div>
    );
};

export default EventDetailsPage;