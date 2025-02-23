import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from './routes/auth.js';
import testRouter from './routes/test.js';
import dataRouter from './routes/data.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_USER = process.env.DB_USER || "vladhaleta2023";
const DB_NAME = process.env.DB_NAME || "HIT";
const DB_PASSWORD = process.env.DB_PASSWORD || "vladhaleta2023";

app.use(cors({
    origin: 'https://keen-nasturtium-cf96fc.netlify.app/', // https://history-6oq2.onrender.com
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
}));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/test', testRouter);
app.use('/api/test', dataRouter);

app.use((req, res, next) => {
    console.log('User-Agent:', req.headers['user-agent']);
    next();
});

async function connectDatabase() {
    try {
        await mongoose
        .connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.wgh65sg.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
        )
        .then(() => console.log("Database connected"))
        .catch((err) => console.log(`Database error: ${err}`));
    }
    catch (err) {
        console.log(`Database error: ${err}`);
    }
}

async function start() {
    try {
        await connectDatabase();
        app.listen(PORT, (err) => {
            if (err) 
                return console.log(`Server error: ${err}`);
            console.log(`Server running on PORT: ${PORT}`);
        })
    }
    catch (err) {
        console.log(`Server error: ${err}`);
    }
}

start();
