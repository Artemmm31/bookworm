import express from 'express';
import cloudinary from '../lib/cloudinary';
import Book from '../models/Book';
import protectRoute from '../middleware/auth';

const router = express.Router();

router.post('/', protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;

        if(!image || !title || !caption || !rating) return res.status(400).json({message: 'Please provide all fields'});

        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: (req as any).user._id,
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.log('error creating a book', error);
        const err = error as Error;
        res.status(500).json({message: err.message})
    }
})

export default router;