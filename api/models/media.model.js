import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    altText: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
