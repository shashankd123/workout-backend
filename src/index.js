// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Verify API key presence
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
    console.error('Error: OPENROUTER_API_KEY not found in environment');
    process.exit(1);
}

// Initialize express app
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import { generateWorkout } from './controllers/workout.controller.js';

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Common React and Vite ports
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Trust proxy - required for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100
});
app.use(limiter);

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

app.post('/api/generate-workout', generateWorkout);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API endpoints:`);
    console.log(`- Test: http://localhost:${port}/api/test`);
    console.log(`- Generate workout: http://localhost:${port}/api/generate-workout`);
});
