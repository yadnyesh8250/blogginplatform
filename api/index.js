import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

// Routes
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import uploadRoutes from './routes/upload.route.js';
import categoryRoutes from './routes/category.route.js';
import tagRoutes from './routes/tag.route.js';
import settingsRoutes from './routes/settings.route.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Load environment variables
dotenv.config({ path: './api/.env' });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => { console.log('MongoDB is connected ✅'); })
  .catch((err) => { console.log('MongoDB connection error ❌:', err); });

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/settings', settingsRoutes);

// Serve static frontend in production
const __dirname = path.resolve();
const clientDist = path.join(__dirname, '/client/dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[ERROR] ${statusCode}: ${message}`);
  res.status(statusCode).json({ success: false, statusCode, message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});