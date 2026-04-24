import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { prisma } from './src/server/db.js';
import { hashPassword, comparePassword, createToken, verifyToken } from './src/server/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());

  // API Routes
  const apiRouter = express.Router();

  // Middleware to check auth
  const authenticate = async (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Unauthorized' });
    req.user = payload;
    next();
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'ADMIN' && req.user?.email !== 'asif17111998@gmail.com') return res.status(403).json({ error: 'Forbidden' });
    next();
  };

  const isTherapist = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'THERAPIST' && req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    next();
  };

  // Auth Routes
  apiRouter.post('/auth/register', async (req, res) => {
    try {
      const { fullName, email, password, role } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: 'Email already exists' });

      const pwdHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash: pwdHash,
          role: role || 'CLIENT',
        },
      });

      // If user is a therapist, create profile
      if (role === 'THERAPIST') {
        const { specialization, experienceYears, bio, qualifications } = req.body;
        await prisma.therapist.create({
          data: {
            userId: user.id,
            specialization: specialization || 'General',
            experienceYears: Number(experienceYears) || 0,
            professionalBio: bio || '',
            qualifications: qualifications || '',
          },
        });
      }

      const token = await createToken({ id: user.id, email: user.email, role: user.role });
      res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
      res.json({ user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });

      const valid = await comparePassword(password, user.passwordHash);
      if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

      const token = await createToken({ id: user.id, email: user.email, role: user.role });
      res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
      res.json({ user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  apiRouter.get('/auth/me', authenticate, async (req: any, res) => {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.id },
      include: { therapistProfile: true }
    });
    res.json({ user });
  });

  // Therapist Routes
  apiRouter.get('/therapists', async (req, res) => {
    const { specialization, minExp } = req.query;
    const therapists = await prisma.therapist.findMany({
      where: {
        specialization: specialization ? String(specialization) : undefined,
        experienceYears: minExp ? { gte: Number(minExp) } : undefined,
      },
      include: { user: { select: { fullName: true, email: true } } }
    });
    res.json(therapists);
  });

  apiRouter.get('/therapists/:id', async (req, res) => {
    const therapist = await prisma.therapist.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { fullName: true, email: true } } }
    });
    res.json(therapist);
  });

  // Appointment Routes
  apiRouter.post('/appointments', authenticate, async (req: any, res) => {
    try {
      const { therapistId, date, time, sessionType, notes } = req.body;
      
      // Check for conflict (prevent double booking)
      const existing = await prisma.appointment.findFirst({
        where: {
          therapistId,
          appointmentDate: new Date(date),
          appointmentTime: time,
          status: { not: 'CANCELLED' }
        }
      });

      if (existing) return res.status(400).json({ error: 'This slot is already booked' });

      const appointment = await prisma.appointment.create({
        data: {
          userId: req.user.id,
          therapistId,
          appointmentDate: new Date(date),
          appointmentTime: time,
          sessionType,
          notes,
        },
      });
      res.json(appointment);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.get('/appointments/my', authenticate, async (req: any, res) => {
    const appointments = await prisma.appointment.findMany({
      where: req.user.role === 'THERAPIST' 
        ? { therapist: { userId: req.user.id } }
        : { userId: req.user.id },
      include: { 
        therapist: { include: { user: { select: { fullName: true } } } },
        client: { select: { fullName: true } },
        sessionRecord: true
      },
      orderBy: { appointmentDate: 'desc' }
    });
    res.json(appointments);
  });

  apiRouter.patch('/appointments/:id/status', authenticate, async (req: any, res) => {
    const { status } = req.body;
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(appointment);
  });

  // Session Record Routes
  apiRouter.post('/session-records', authenticate, isTherapist, async (req: any, res) => {
    const { appointmentId, summary, therapistNotes, followUpDate, remarks } = req.body;
    const record = await prisma.sessionRecord.create({
      data: {
        appointmentId,
        summary,
        therapistNotes,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        remarks,
      }
    });

    // Mark appointment as COMPLETED
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' }
    });

    res.json(record);
  });

  // Admin Routes
  apiRouter.get('/admin/analytics', authenticate, isAdmin, async (req, res) => {
    const totalUsers = await prisma.user.count();
    const totalTherapists = await prisma.therapist.count();
    const totalAppointments = await prisma.appointment.count();
    const pendingAppointments = await prisma.appointment.count({ where: { status: 'PENDING' } });
    const completedAppointments = await prisma.appointment.count({ where: { status: 'COMPLETED' } });

    res.json({
      totalUsers,
      totalTherapists,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
    });
  });

  app.use('/api', apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
