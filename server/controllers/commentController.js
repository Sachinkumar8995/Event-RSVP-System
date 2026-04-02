const Comment = require('../models/Comment');

/**
 * @desc    Get all comments for an event
 * @route   GET /api/comments/:eventId
 * @access  Public
 */
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ event: req.params.eventId })
            .populate('user', 'name profileImage')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Add a comment
 * @route   POST /api/comments
 * @access  Private
 */
const addComment = async (req, res) => {
    try {
        const { eventId, content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const comment = await Comment.create({
            event: eventId,
            user: req.user._id,
            content
        });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'name profileImage');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private/Owner or Admin
 */
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership or admin status
        if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to delete this comment' });
        }

        await Comment.deleteOne({ _id: req.params.id });

        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getComments,
    addComment,
    deleteComment
};
