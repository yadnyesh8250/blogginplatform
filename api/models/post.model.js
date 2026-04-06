import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    title: { type: String, unique: true },
    image: String,
    category: String,
    slug: { type: String, unique: true },

    theme: {
      type: String,
      enum: ['minimal', 'midnight', 'aurora', 'newspaper', 'cyberpunk', 'nature', 'sunset', 'ocean', 'mono', 'blueprint', 'botanical', 'swiss'],
      default: 'minimal',
    },

    excerpt: { type: String, default: '' },

    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'trash'],
      default: 'draft',
    },

    visibility: {
      type: String,
      enum: ['public', 'private', 'password'],
      default: 'public',
    },

    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],

    tags: {
      type: [String],
      default: [],
    },

    fontFamily: {
      type: String,
      enum: ['serif', 'sans-serif', 'mono'],
      default: 'sans-serif',
    },

    accentColor: {
      type: String,
      default: '#6366f1', // indigo-500
    },

    layoutStyle: {
      type: String,
      enum: ['standard', 'editorial', 'minimal'],
      default: 'standard',
    },

    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },

    likes: {
      type: [String], // user IDs
      default: [],
    },

    numberOfLikes: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);