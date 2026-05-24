import { Resend } from 'resend';

let resend: Resend | null = null;

export const getResend = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not defined. Emails will be logged to console instead.');
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

export const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  const client = getResend();
  const from = 'Theramint <onboarding@resend.dev>'; // Resend testing domain
  
  // Development Override Logic
  const devOverride = process.env.DEV_EMAIL_OVERRIDE;
  const actualRecipient = (process.env.NODE_ENV === 'development' && devOverride) ? devOverride : to;

  if (devOverride && process.env.NODE_ENV === 'development') {
    console.log(`[EMAIL OVERRIDE] Redirecting mail from ${to} to ${actualRecipient}`);
  }

  if (!client) {
    console.log('--- EMAIL SIMULATION ---');
    console.log(`To: ${actualRecipient} (Original: ${to})`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log('------------------------');
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await client.emails.send({
      from,
      to: actualRecipient,
      subject: `${process.env.NODE_ENV === 'development' ? '[DEV] ' : ''}${subject}`,
      html,
    });

    if (error) {
      console.error('Resend Error:', error);
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Failed to send email:', err);
    throw err;
  }
};

export const emailTemplates = {
  welcome: (name: string, verifyUrl: string) => ({
    subject: 'Welcome to Theramint - Verify Your Journey',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #0d9488;">Theramint</h1>
        <h2>Welcome, ${name}!</h2>
        <p>Your journey towards mindful mental healthcare begins here. Please verify your email to activate your account.</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email</a>
        <p style="margin-top: 24px; font-size: 12px; color: #666;">This link expires in 10 minutes.</p>
      </div>
    `
  }),
  twoFactor: (code: string) => ({
    subject: 'Your Theramint Security Code',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #0d9488;">Theramint</h1>
        <h2>Security Verification</h2>
        <p>Enter the following code to complete your sign-in. This code is valid for 10 minutes.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; padding: 24px; background: #f3f4f6; text-align: center; border-radius: 12px; color: #0d9488;">
          ${code}
        </div>
      </div>
    `
  }),
  forgotPassword: (resetUrl: string) => ({
    subject: 'Theramint - Password Reset Request',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #0d9488;">Theramint</h1>
        <h2>Reset Your Password</h2>
        <p>A password reset was requested for your account. If you didn't do this, ignore this email.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
        <p style="margin-top: 24px; font-size: 12px; color: #666;">This link expires in 1 hour.</p>
      </div>
    `
  }),
  passwordChanged: () => ({
    subject: 'Theramint Access Update - Password Changed',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #0d9488;">Theramint</h1>
        <h2>Success</h2>
        <p>Your account password has been successfully updated. If you did not make this change, please contact support immediately.</p>
      </div>
    `
  }),
  bookingConfirmation: (details: any) => ({
    subject: 'Booking Confirmed - Theramint',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #0d9488;">Theramint</h1>
        <h2>Your Connection is Confirmed</h2>
        <p>We've received your request and it has been sent to the therapist.</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 12px;">
          <p><strong>Therapist:</strong> ${details.therapistName}</p>
          <p><strong>Date:</strong> ${details.date}</p>
          <p><strong>Time:</strong> ${details.time}</p>
          <p><strong>Type:</strong> ${details.type}</p>
        </div>
      </div>
    `
  }),
  bookingStatusUpdate: (status: string, details: any) => ({
    subject: `Update on Your Session Request - ${status}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #0d9488;">Theramint</h1>
        <h2>Request Status: ${status}</h2>
        <p>The therapist has ${status.toLowerCase()} your session request.</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 12px;">
          <p><strong>Session with:</strong> ${details.therapistName}</p>
          <p><strong>Date:</strong> ${details.date}</p>
        </div>
      </div>
    `
  }),
  rescheduleNotification: (details: any) => ({
    subject: 'Action Required: Session Rescheduled - Theramint',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #0d9488;">Theramint</h1>
        <h2>Session Rescheduled</h2>
        <p>A client has rescheduled their session with you.</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <p><strong>Client:</strong> ${details.clientName}</p>
          <p><strong>New Date:</strong> ${details.newDate}</p>
          <p><strong>New Time:</strong> ${details.newTime}</p>
        </div>
        <p style="margin-top: 20px;">Please log in to your dashboard to review the update.</p>
      </div>
    `
  }),
  cancellationNotification: (details: any) => ({
    subject: 'Session Cancelled - Theramint',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #0d9488;">Theramint</h1>
        <h2 style="color: #e11d48;">Session Cancelled</h2>
        <p>A session has been cancelled.</p>
        <div style="background: #fff1f2; padding: 20px; border-radius: 12px; border: 1px solid #fecdd3;">
          <p><strong>With:</strong> ${details.name}</p>
          <p><strong>Was Scheduled For:</strong> ${details.date}</p>
        </div>
      </div>
    `
  }),
  paymentSuccess: (details: any) => ({
    subject: 'Payment Received - Theramint',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #0d9488;">Theramint</h1>
        <h2>Payment Successful</h2>
        <p>We've received a payment for your scheduled session.</p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0;">
          <p><strong>Amount:</strong> ${details.amount}</p>
          <p><strong>Reference:</strong> ${details.id}</p>
          <p><strong>Therapist:</strong> ${details.therapistName}</p>
        </div>
      </div>
    `
  }),
  invoice: (details: any) => ({
    subject: 'Your Theramint Invoice',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; border: 1px solid #eee; padding: 40px; border-radius: 24px;">
        <div style="text-align: right; color: #999; font-size: 12px;">Invoice #${details.id}</div>
        <h1 style="color: #0d9488; margin-bottom: 40px;">Theramint</h1>
        <div style="margin-bottom: 40px;">
          <h3 style="margin-bottom: 10px;">Bill To:</h3>
          <p style="margin: 0;">${details.clientName}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr style="border-bottom: 2px solid #f3f4f6;">
              <th style="padding: 12px 0; text-align: left;">Service</th>
              <th style="padding: 12px 0; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px 0;">Therapy Session - ${details.therapistName}</td>
              <td style="padding: 12px 0; text-align: right;">${details.amount}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; border-top: 2px solid #f3f4f6;">
              <td style="padding: 12px 0;">Total Paid</td>
              <td style="padding: 12px 0; text-align: right;">${details.amount}</td>
            </tr>
          </tfoot>
        </table>
        <p style="text-align: center; color: #666; font-size: 12px;">Thank you for choosing Theramint for your mental wellness journey.</p>
      </div>
    `
  }),
  sessionReminder: (details: any) => ({
    subject: 'Upcoming Session Reminder - Theramint',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; border: 1px solid #0d9488; padding: 40px; border-radius: 24px;">
        <h1 style="color: #0d9488;">Theramint Reminder</h1>
        <h2>Hello ${details.clientName},</h2>
        <p>This is a reminder that you have a session scheduled for next week.</p>
        <div style="background: #f0fdfa; padding: 24px; border-radius: 16px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Therapist:</strong> ${details.therapistName}</p>
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${details.date}</p>
          <p style="margin: 0;"><strong>Time:</strong> ${details.time}</p>
        </div>
        <p>We look forward to seeing you. If you need to reschedule, please visit your dashboard.</p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          This is an automated reminder from Theramint.
        </div>
      </div>
    `
  })
};
