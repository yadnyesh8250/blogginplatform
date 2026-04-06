import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  // Generate slug from title
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '')
    + '-' + Date.now(); // append timestamp to ensure uniqueness

  const newPost = new Post({
    userId: req.user.id,
    title: req.body.title,
    content: req.body.content,
    image: req.body.image || '',
    category: req.body.category || 'uncategorized',
    slug,
    theme: req.body.theme || 'minimal',
    excerpt: req.body.excerpt || '',
    status: req.body.status || 'draft',
    visibility: req.body.visibility || 'public',
    categories: req.body.categories || [],
    tags: req.body.tags || [],
    metaTitle: req.body.metaTitle || '',
    metaDescription: req.body.metaDescription || '',
    fontFamily: req.body.fontFamily || 'sans-serif',
    accentColor: req.body.accentColor || '#6366f1',
    layoutStyle: req.body.layoutStyle || 'standard',
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('[create post error]', error.message);
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, 'Post not found'));

    const userIndex = post.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      post.likes.push(req.user.id);
      post.numberOfLikes += 1;
    } else {
      post.likes.splice(userIndex, 1);
      post.numberOfLikes -= 1;
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    // Increment view count when fetching by slug
    if (req.query.slug) {
      const post = await Post.findOne({ slug: req.query.slug });
      if (post) { post.views += 1; await post.save(); }
    }

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.categories && { categories: { $in: req.query.categories.split(',') } }),
      ...(req.query.status && { status: req.query.status }),
      ...(req.query.visibility && { visibility: req.query.visibility }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate('userId', 'username profilePicture');

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          status: req.body.status,
          visibility: req.body.visibility,
          categories: req.body.categories,
          tags: req.body.tags,
          metaTitle: req.body.metaTitle,
          metaDescription: req.body.metaDescription,
          theme: req.body.theme,
          excerpt: req.body.excerpt,
          fontFamily: req.body.fontFamily,
          accentColor: req.body.accentColor,
          layoutStyle: req.body.layoutStyle,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};