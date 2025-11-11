import express from 'express';
import cors from 'cors';
import 'dotenv/config'

import authRoutes from './routes/authRoutes'
import bookRoutes from './routes/bookRoutes'


import { connectDB } from './lib/db';


const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);


app.listen(PORT, () => {
    console.log({PORT});
    connectDB();
})