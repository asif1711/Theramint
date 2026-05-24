import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { prisma } from './src/server/db.js';
import { hashPassword, comparePassword, createToken, verifyToken } from './src/server/auth.js';
import { sendEmail, emailTemplates } from './src/services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());

  // Request Logging
  app.use((req, res, next) => {
    console.log(`[SERVER] ${req.method} ${req.url}`);
    next();
  });

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
      
      // Email Verification setup
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpiry = new Date(Date.now() + 600000); // 10 minutes

      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash: pwdHash,
          role: role || 'CLIENT',
          verificationToken,
          verificationTokenExpiry: verificationExpiry,
          emailVerified: false
        },
      });

      // Send Welcome & Verification Email
      const verifyUrl = `${process.env.APP_URL || `http://localhost:${PORT}`}/auth?mode=verify&token=${verificationToken}`;
      await sendEmail({
        to: email,
        ...emailTemplates.welcome(fullName, verifyUrl)
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

      res.json({ 
        message: 'Account created. Please check your email for the verification link.',
        unverified: true 
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post('/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          verificationToken: token,
          verificationTokenExpiry: { gte: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null
        }
      });

      res.json({ message: 'Email verified successfully. You can now log in.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post('/auth/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        return res.json({ message: 'If an account exists, a new verification link has been sent.' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ error: 'Email is already verified' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 600000); // 10 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationToken: token,
          verificationTokenExpiry: expiry
        }
      });

      const verifyUrl = `${process.env.APP_URL || `http://localhost:${PORT}`}/auth?mode=verify&token=${token}`;
      await sendEmail({
        to: email,
        ...emailTemplates.welcome(user.fullName, verifyUrl)
      });

      res.json({ message: 'A new verification link has been sent to your email.' });
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

      if (!user.emailVerified) {
        console.log(`[AUTH] Login blocked (unverified): ${email}`);
        return res.status(401).json({ error: 'Email not verified. Please check your inbox for the verification link.' });
      }

      console.log(`[AUTH] Login success: ${email}`);

      // 2FA Check (Hold for 24h)
      const lastSessionStart = user.last2FADone;
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const needs2FA = !lastSessionStart || lastSessionStart < twentyFourHoursAgo;

      if (needs2FA) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 600000); // 10 mins

        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorCode: code,
            twoFactorExpiry: expiry
          }
        });

        await sendEmail({
          to: user.email,
          ...emailTemplates.twoFactor(code)
        });

        return res.json({ 
          twoFactorRequired: true, 
          message: 'Security code sent to your email.' 
        });
      }

      const token = await createToken({ id: user.id, email: user.email, role: user.role });
      res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
      res.json({ user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post('/auth/verify-2fa', async (req, res) => {
    try {
      const { email, code } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          email,
          twoFactorCode: code,
          twoFactorExpiry: { gte: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired security code' });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorCode: null,
          twoFactorExpiry: null,
          last2FADone: new Date()
        }
      });

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

  apiRouter.post('/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        return res.json({ message: 'If an account exists with that email, a reset link will be sent.' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 3600000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiry: expiry
        }
      });

      const resetUrl = `${process.env.APP_URL || `http://localhost:${PORT}`}/reset-password?token=${token}`;
      await sendEmail({
        to: email,
        ...emailTemplates.forgotPassword(resetUrl)
      });
      
      res.json({ 
        message: 'If an account exists with that email, a reset link will be sent.'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post('/auth/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: { gte: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const pwdHash = await hashPassword(password);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: pwdHash,
          resetToken: null,
          resetTokenExpiry: null
        }
      });

      await sendEmail({
        to: user.email,
        ...emailTemplates.passwordChanged()
      });

      res.json({ message: 'Password reset successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
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

  apiRouter.get('/therapists/:id/availability', async (req, res) => {
    try {
      const { date } = req.query;
      if (!date) return res.status(400).json({ error: 'Date is required' });

      const startDate = new Date(String(date));
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const appointments = await prisma.appointment.findMany({
        where: {
          therapistId: req.params.id,
          appointmentDate: {
            gte: startDate,
            lt: endDate
          },
          status: { in: ['PENDING', 'CONFIRMED', 'REJECTED'] }
        },
        select: {
          appointmentTime: true,
          status: true
        }
      });

      res.json(appointments);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin/System Job: Send Reminders (1 week prior)
  apiRouter.post('/jobs/send-reminders', async (req, res) => {
    try {
      // In a real app, protect this with a secret key or IAM
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
      targetDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const appointments = await prisma.appointment.findMany({
        where: {
          appointmentDate: {
            gte: targetDate,
            lt: nextDay
          },
          status: 'CONFIRMED'
        },
        include: {
          client: { select: { email: true, fullName: true } },
          therapist: { include: { user: { select: { fullName: true } } } }
        }
      });

      let sentCount = 0;
      for (const app of appointments) {
        await sendEmail({
          to: app.client.email,
          ...emailTemplates.sessionReminder({
            clientName: app.client.fullName,
            therapistName: app.therapist.user.fullName,
            date: app.appointmentDate.toDateString(),
            time: app.appointmentTime
          })
        });
        sentCount++;
      }

      res.json({ success: true, sentCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
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
        include: { 
          therapist: { include: { user: { select: { fullName: true } } } },
          client: { select: { email: true, fullName: true } }
        }
      });

      // Send Confirmation Email to Client
      await sendEmail({
        to: appointment.client.email,
        ...emailTemplates.bookingConfirmation({
          therapistName: appointment.therapist.user.fullName,
          date,
          time,
          type: sessionType
        })
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
    try {
      const { status } = req.body;
      const appointment = await prisma.appointment.findUnique({
        where: { id: req.params.id },
        include: { therapist: true }
      });

      if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

      // Only allow assigned therapist or the client to update
      const isOwner = appointment.userId === req.user.id;
      const isAssignedTherapist = appointment.therapist.userId === req.user.id;
      
      if (!isOwner && !isAssignedTherapist && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // If client is cancelling, it's allowed
      if (isOwner && status !== 'CANCELLED') {
        return res.status(403).json({ error: 'Clients can only cancel sessions currently.' });
      }

      const updated = await prisma.appointment.update({
        where: { id: req.params.id },
        data: { status },
        include: { 
          client: { select: { email: true, fullName: true } },
          therapist: { include: { user: { select: { fullName: true } } } }
        }
      });

      // Send status update email if the status changed to ACCEPTED or REJECTED or CANCELLED
      if (['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
        await sendEmail({
          to: updated.client.email,
          ...emailTemplates.bookingStatusUpdate(status, {
            therapistName: updated.therapist.user.fullName,
            date: updated.appointmentDate.toDateString()
          })
        });

        // If client is cancelling, notify therapist
        if (status === 'CANCELLED' && isOwner) {
          await sendEmail({
            to: (await prisma.user.findUnique({ where: { id: updated.therapist.userId } }))?.email || '',
            ...emailTemplates.cancellationNotification({
              name: updated.client.fullName,
              date: updated.appointmentDate.toDateString()
            })
          });
        }
      }

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.patch('/appointments/:id/payment', authenticate, async (req: any, res) => {
    try {
      const { paymentStatus } = req.body;
      const appointment = await prisma.appointment.findUnique({
        where: { id: req.params.id }
      });

      if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
      
      const therapist = await prisma.therapist.findUnique({ where: { userId: req.user.id } });
      const isOwner = appointment.userId === req.user.id;
      const isTherapistAssigned = therapist && appointment.therapistId === therapist.id;
      const isAdmin = req.user.role === 'ADMIN';

      if (!isOwner && !isTherapistAssigned && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updated = await prisma.appointment.update({
        where: { id: req.params.id },
        data: { paymentStatus },
        include: {
          client: { select: { email: true, fullName: true } },
          therapist: { include: { user: { select: { fullName: true, email: true } } } }
        }
      });

      if (paymentStatus === 'PAID') {
        const amount = "$120.00"; // Assuming flat rate for now, or could fetch from therapist profile
        
        // Notify Therapist
        await sendEmail({
          to: updated.therapist.user.email,
          ...emailTemplates.paymentSuccess({
            amount,
            id: updated.id,
            therapistName: updated.therapist.user.fullName
          })
        });

        // Send Invoice to Client
        await sendEmail({
          to: updated.client.email,
          ...emailTemplates.invoice({
            id: updated.id,
            clientName: updated.client.fullName,
            therapistName: updated.therapist.user.fullName,
            amount
          })
        });
      }

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.patch('/appointments/:id/reschedule', authenticate, async (req: any, res) => {
    try {
      const { date, time } = req.body;
      const appointment = await prisma.appointment.findUnique({
        where: { id: req.params.id }
      });

      if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
      if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updated = await prisma.appointment.update({
        where: { id: req.params.id },
        data: { 
          appointmentDate: new Date(date),
          appointmentTime: time,
          status: 'PENDING' // Reset to pending if rescheduled
        },
        include: {
          client: { select: { fullName: true } },
          therapist: { include: { user: { select: { email: true } } } }
        }
      });

      // Notify Therapist of Reschedule
      await sendEmail({
        to: updated.therapist.user.email,
        ...emailTemplates.rescheduleNotification({
          clientName: updated.client.fullName,
          newDate: new Date(date).toDateString(),
          newTime: time
        })
      });

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
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

  apiRouter.get('/admin/report/csv', authenticate, isAdmin, async (req, res) => {
    try {
      // 1. Fetch summary stats
      const totalUsers = await prisma.user.count();
      const totalTherapists = await prisma.therapist.count();
      const totalAppointments = await prisma.appointment.count();
      const pendingAppointments = await prisma.appointment.count({ where: { status: 'PENDING' } });
      const completedAppointments = await prisma.appointment.count({ where: { status: 'COMPLETED' } });

      // 2. Fetch Users
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });

      // 3. Fetch Therapists
      const therapists = await prisma.therapist.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });

      // 4. Fetch Appointments
      const appointments = await prisma.appointment.findMany({
        include: {
          client: true,
          therapist: { include: { user: true } }
        },
        orderBy: { appointmentDate: 'desc' }
      });

      // 5. Fetch Support Requests
      const supportRequests = await prisma.supportRequest.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });

      // Helper function to escape CSV values
      const escape = (val: any) => {
        if (val === null || val === undefined) return '';
        let str = String(val);
        // Replace double quotes with internal double quotes escalated
        str = str.replace(/"/g, '""');
        // Wrap in quotes if it has double quotes, comma, newline or carriage return
        if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
          return `"${str}"`;
        }
        return `"${str}"`;
      };

      let csvContent = "";

      // Summary Section
      csvContent += `=== THERAMINT SYSTEM ADMINISTRATIVE MASTER REPORT ===\n`;
      csvContent += `Report Compiled At,${escape(new Date().toISOString())}\n`;
      csvContent += `Total Platform Users,${escape(totalUsers)}\n`;
      csvContent += `Registered Practitioners,${escape(totalTherapists)}\n`;
      csvContent += `Scheduled Interactions,${escape(totalAppointments)}\n`;
      csvContent += `Completed Sessions,${escape(completedAppointments)}\n`;
      csvContent += `Pending Verification/Approval Sessions,${escape(pendingAppointments)}\n`;
      csvContent += `\n\n`;

      // Users Section
      csvContent += `=== SYSTEM ACCOUNT LISTING ===\n`;
      csvContent += `User ID,Full Name,Email,Role,Status,Verified Status,Licensed Status,Joining Date\n`;
      for (const u of users) {
        csvContent += `${escape(u.id)},${escape(u.fullName)},${escape(u.email)},${escape(u.role)},${escape(u.status)},${escape(u.emailVerified)},${escape(u.role === 'THERAPIST' ? 'YES' : 'NO')},${escape(u.createdAt.toISOString())}\n`;
      }
      csvContent += `\n\n`;

      // Therapists Section
      csvContent += `=== PRACTITIONER REGISTRY ===\n`;
      csvContent += `Therapist ID,User ID,Practitioner Name,Email,Core Specialization,Experience Years,Current Availability,Qualifications,Bio\n`;
      for (const t of therapists) {
        const bioText = t.professionalBio ? t.professionalBio.substring(0, 100) + '...' : 'No biographical details';
        csvContent += `${escape(t.id)},${escape(t.userId)},${escape(t.user.fullName)},${escape(t.user.email)},${escape(t.specialization)},${escape(t.experienceYears)},${escape(t.availabilityStatus)},${escape(t.qualifications)},${escape(bioText)}\n`;
      }
      csvContent += `\n\n`;

      // Appointments Section
      csvContent += `=== CONSULTATIONS AND APPOINTMENTS QUEUE ===\n`;
      csvContent += `Appointment ID,Patient Name,Patient Email,Therapist Name,Appointment Date,Time Indicator,Status,Payment State,Charge Amount,Type of Session,Clinical Notes\n`;
      for (const a of appointments) {
        const appDateString = a.appointmentDate ? (a.appointmentDate instanceof Date ? a.appointmentDate.toISOString().split('T')[0] : new Date(a.appointmentDate).toISOString().split('T')[0]) : '';
        csvContent += `${escape(a.id)},${escape(a.client?.fullName)},${escape(a.client?.email)},${escape(a.therapist?.user?.fullName)},${escape(appDateString)},${escape(a.appointmentTime)},${escape(a.status)},${escape(a.paymentStatus)},${escape(a.amount)},${escape(a.sessionType)},${escape(a.notes || 'No administrative notes')}\n`;
      }
      csvContent += `\n\n`;

      // Support Section
      csvContent += `=== ADMINISTRATIVE SUPPORT REQUESTS ===\n`;
      csvContent += `Request ID,Author Name,Author Email,Subject Line,Detailed Message,Priority Level,Status Code,Initiative Date\n`;
      for (const s of supportRequests) {
        csvContent += `${escape(s.id)},${escape(s.user?.fullName)},${escape(s.user?.email)},${escape(s.subject)},${escape(s.message)},${escape(s.priority)},${escape(s.status)},${escape(s.createdAt.toISOString())}\n`;
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=theramint_admin_report.csv');
      res.status(200).send(csvContent);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Failed to generate database admin CSV report: ' + err.message });
    }
  });

  apiRouter.get('/therapist/analytics', authenticate, isTherapist, async (req: any, res) => {
    try {
      const therapist = await prisma.therapist.findUnique({ where: { userId: req.user.id } });
      if (!therapist) return res.status(404).json({ error: 'Therapist profile not found' });

      const totalClients = await prisma.appointment.groupBy({
        by: ['userId'],
        where: { therapistId: therapist.id }
      });

      const totalSessions = await prisma.appointment.count({
        where: { therapistId: therapist.id }
      });

      const completedSessions = await prisma.appointment.count({
        where: { therapistId: therapist.id, status: 'COMPLETED' }
      });

      // Get recent client health info (latest notes/summary from session records)
      const recentRecords = await prisma.sessionRecord.findMany({
        where: { appointment: { therapistId: therapist.id } },
        include: { appointment: { include: { client: { select: { fullName: true } } } } },
        orderBy: { updatedAt: 'desc' },
        take: 5
      });

      res.json({
        totalClients: totalClients.length,
        totalSessions,
        completedSessions,
        recentRecords
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.get('/admin/users', authenticate, isAdmin, async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        include: { therapistProfile: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post('/admin/users', authenticate, isAdmin, async (req, res) => {
    try {
      const { fullName, email, password, role, status, therapistData } = req.body;
      
      const pwdHash = await hashPassword(password);
      
      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          passwordHash: pwdHash,
          role: role || 'CLIENT',
          status: status || 'ACTIVE',
        },
      });

      if (role === 'THERAPIST' && therapistData) {
        await prisma.therapist.create({
          data: {
            userId: user.id,
            specialization: therapistData.specialization || 'General',
            experienceYears: Number(therapistData.experienceYears) || 0,
            professionalBio: therapistData.bio || '',
            qualifications: therapistData.qualifications || '',
            availabilityStatus: therapistData.availabilityStatus || 'Available',
          },
        });
      }
      
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.patch('/admin/users/:id', authenticate, isAdmin, async (req, res) => {
    try {
      const { fullName, email, role, status, therapistData } = req.body;
      
      const targetUser = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (targetUser?.email === 'asif17111998@gmail.com' && role !== 'ADMIN') {
        return res.status(403).json({ error: 'System Admin role cannot be changed' });
      }

      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          fullName,
          email,
          role,
          status,
        },
      });

      if (role === 'THERAPIST' && therapistData) {
        await prisma.therapist.upsert({
          where: { userId: user.id },
          update: {
            specialization: therapistData.specialization,
            experienceYears: Number(therapistData.experienceYears),
            professionalBio: therapistData.bio,
            qualifications: therapistData.qualifications,
            availabilityStatus: therapistData.availabilityStatus,
          },
          create: {
            userId: user.id,
            specialization: therapistData.specialization || 'General',
            experienceYears: Number(therapistData.experienceYears) || 0,
            professionalBio: therapistData.bio || '',
            qualifications: therapistData.qualifications || '',
            availabilityStatus: therapistData.availabilityStatus || 'Available',
          }
        });
      } else if (role !== 'THERAPIST') {
        // If role changed from therapist, maybe delete the profile?
        // For now keep it or just don't update it.
      }
      
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.delete('/admin/users/:id', authenticate, isAdmin, async (req, res) => {
    try {
      const targetUser = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (targetUser?.email === 'asif17111998@gmail.com') {
        return res.status(403).json({ error: 'System Admin cannot be deleted' });
      }

      await prisma.user.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.patch('/admin/users/:id/status', authenticate, isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { status }
      });
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Catch-all 404 for API
  apiRouter.use((req, res) => {
    console.warn(`[API 404] ${req.method} ${req.url}`);
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  app.use('/api', apiRouter);

  // Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('[SERVER ERROR]', err);
    res.status(err.status || 500).json({ 
      error: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

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
