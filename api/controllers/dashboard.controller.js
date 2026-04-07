import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';

export const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();

    const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    const users = await User.find().sort({ createdAt: -1 }).limit(5);
    const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
    const comments = await Comment.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalPosts,
      totalComments,
      lastMonthUsers,
      lastMonthPosts,
      lastMonthComments,
      users,
      posts,
      comments,
    });
  } catch (error) {
    next(error);
  }
};