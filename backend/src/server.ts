import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './config/db';
import { authenticateToken } from './middleware/auth';
import { z } from 'zod';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dev_only';

// Middleware
// Cast cors to any to avoid strict type definition mismatch with Express RequestHandler
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
}) as any);
app.use(express.json());

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

// Routes

// POST /api/v1/auth/register
app.post('/api/v1/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    
    // Check if user exists
    const [existing] = await pool.query<any[]>('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query<any>(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: result.insertId, name, email }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as z.ZodError).errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/auth/login
app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const [users] = await pool.query<any[]>('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as z.ZodError).errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/auth/me
// authenticateToken ensures req.user is set. Use req: any to bypass strict type checking on Request props in handler.
app.get('/api/v1/auth/me', authenticateToken, async (req: any, res: Response) => {
  try {
    const [users] = await pool.query<any[]>('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});