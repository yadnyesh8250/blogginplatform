import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: 'Blogify' },
    siteTagline: { type: String, default: 'My Advanced Blogging Platform' },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    footerText: { type: String, default: '© 2026 Blogify. All rights reserved.' },
    contactEmail: { type: String, default: '' },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' },
    }
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
