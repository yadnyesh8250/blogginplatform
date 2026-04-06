import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';

export const getDashboard = async (req, res, next) => {
  try {
    // 🔥 TOTAL COUNTS
    const users = await User.countDocuments();
    const posts = await Post.countDocuments();
    const comments = await Comment.countDocuments();

    // 🔥 RECENT DATA
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      users,
      posts,
      comments,
      recentUsers,
      recentPosts,
      recentComments,
    });
  } catch (error) {
    next(error);
  }
};