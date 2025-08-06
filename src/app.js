import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// --- Core Middlewares ---
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// --- Route Imports ---
import authRouter from './api/auth.routes.js';
import userRouter from './api/users.routes.js';
import requestRouter from './api/requests.routes.js';

// --- Route Declarations ---
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/requests', requestRouter);

// --- Healthcheck Route ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Backend is healthy' });
});

// --- Centralized Error Handler ---
app.use(errorMiddleware);

export { app };