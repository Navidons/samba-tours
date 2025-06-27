import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

// Import all email templates
import { BookingConfirmationEmail } from '@/components/emails/booking-confirmation-email';
import { BookingConfirmedEmail } from '@/components/emails/booking-confirmed-email';
import { PaymentConfirmationEmail } from '@/components/emails/payment-confirmation-email';
import React from 'react';

// Map template names to components
const emailTemplates: { [key: string]: React.ComponentType<any> } = {
  bookingConfirmation: BookingConfirmationEmail,
  bookingConfirmed: BookingConfirmedEmail,
  paymentConfirmation: PaymentConfirmationEmail,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, template, data } = body;

    if (!to || !subject || !template || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const EmailComponent = emailTemplates[template];
    if (!EmailComponent) {
      return NextResponse.json({ error: 'Invalid email template' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailHtml = await render(React.createElement(EmailComponent, data));

    const options = {
      from: process.env.SMTP_FROM_EMAIL || 'Samba Tours <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: emailHtml,
    };

    await transporter.sendMail(options);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (e) {
    console.error("API Route Error:", e);
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 