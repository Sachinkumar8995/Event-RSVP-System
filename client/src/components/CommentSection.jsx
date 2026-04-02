import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Send, Trash2, MessageCircle, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ eventId }) => {
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [eventId]);

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/comments/${eventId}`);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            const { data } = await api.post('/comments', { eventId, content });
            setComments([data, ...comments]);
            setContent('');
            toast.success('Comment added!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success('Comment deleted');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    return (
        <div className="relative mt-16 pt-12 border-t border-gray-100 dark:border-white/10 
            dark:bg-gradient-to-br dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#020617] rounded-3xl p-6 overflow-hidden">

            {/* Glow */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full"></div>

            {/* Header */}
            <div className="relative flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2.5 bg-primary-500/10 rounded-2xl text-primary-400">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    Discussions
                </h3>

                <div className="flex items-center gap-2 px-4 py-1.5 
                    bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10">
                    <span className="h-2 w-2 bg-primary-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                    </span>
                </div>
            </div>

            {/* Input */}
            {user ? (
                <div className="mb-12">
                    <form 
                        onSubmit={handleSubmit} 
                        className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 
                        rounded-[2rem] p-2 shadow-lg focus-within:ring-2 focus-within:ring-primary-500/40 transition">

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full px-6 py-4 bg-transparent text-gray-800 dark:text-gray-200 outline-none resize-none min-h-[120px]"
                            maxLength={500}
                        />

                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-gray-400" />
                                    </div>
                                )}
                                <span className="text-xs text-gray-400">
                                    {content.length}/500
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !content.trim()}
                                className="flex items-center gap-2 px-6 py-2.5 
                                bg-gradient-to-r from-primary-500 to-blue-600 
                                hover:from-primary-600 hover:to-blue-700 
                                text-white font-bold rounded-full shadow-lg active:scale-95">
                                {submitting ? 'Posting...' : <>Post <Send className="w-4 h-4" /></>}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] text-center mb-12 border border-white/10">
                    <UserIcon className="w-10 h-10 text-primary-400 mx-auto mb-3" />
                    <p className="text-gray-400 mb-3">Join the conversation</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-6 py-2 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-full">
                        Sign In
                    </button>
                </div>
            )}

            {/* Comments */}
            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex gap-4">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-2xl"></div>
                            <div className="flex-grow space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/4"></div>
                                <div className="h-20 bg-gray-100 dark:bg-white/5 rounded-3xl"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4">
                            {comment.user.profileImage ? (
                                <img
                                    src={comment.user.profileImage.startsWith('http') ? comment.user.profileImage : `http://localhost:5000${comment.user.profileImage}`}
                                    alt={comment.user.name}
                                    className="w-12 h-12 rounded-2xl object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-gray-400" />
                                </div>
                            )}

                            <div className="flex-grow">
                                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 
                                    backdrop-blur-xl p-5 rounded-3xl shadow-lg transition">

                                    <div className="flex justify-between mb-2">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {comment.user.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>

                                        {(user?._id === comment.user._id || user?.isAdmin) && (
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="text-gray-400 hover:text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-400">
                    No comments yet 🚀
                </div>
            )}
        </div>
    );
};

export default CommentSection;