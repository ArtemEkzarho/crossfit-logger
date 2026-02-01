import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';
import exerciseRoutes from './routes/exercises'; 

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Clerk middleware - MUST be before routes
app.use(clerkMiddleware());

// MongoDB Connection
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'CrossFit Logger API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/exercises', exerciseRoutes);  // ← ADD THIS

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});