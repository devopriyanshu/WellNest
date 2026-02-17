import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create transporter
const createTransporter = async () => {
  // Production: Use SMTP from env
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Development: Use Ethereal (Fake SMTP)
  // This prints a URL to the console to view the email
  logger.info('Using Ethereal Email for development');
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
};

/*
 * Send an email
 * @param {Object} options - { to, subject, html }
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: '"WellNest" <no-reply@wellnest.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    logger.info(`Message sent: ${info.messageId}`);
    
    // Preview only available when using Ethereal account
    if (nodemailer.getTestMessageUrl(info)) {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw error;
  }
};

/*
 * Send Verification Email
 * @param {string} email
 * @param {string} token
 */
export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  const subject = 'Verify your email address - WellNest';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Welcome to WellNest!</h2>
      <p>Thank you for signing up. Please click the link below to verify your email address and activate your account.</p>
      <div style="margin: 20px 0;">
        <a href="${verificationLink}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
      </div>
      <p>Or verify using this link: <a href="${verificationLink}">${verificationLink}</a></p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't create an account, you can ignore this email.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};
