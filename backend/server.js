import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import userRouter from './router/user.router.js'
import postRouter from './router/post.router.js'
import commentRouter from './router/comment.router.js'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors';
import { promises as fs } from 'fs';

dotenv.config()

const PORT = process.env.PORT || 7000
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/comment',commentRouter)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const ensureUploadsDirectory = async () => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    await fs.access(uploadsDir).catch(async () => {
      await fs.mkdir(uploadsDir, { recursive: true });
      console.log('Created uploads directory');
    });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
};

app.listen(PORT, async () => {
    await ensureUploadsDirectory();
    connectDB();
    console.log(`Server run at http://localhost:${PORT}`);
});
