import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import BookingConfirmationEmail from '@/components/emails/booking-confirmation-email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
        customer_name, 
        customer_email, 
        booking_reference, 
        items, 
        total 
    } = body;

    if (!customer_email || !customer_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD, // This should be your Resend API Key
      },
    });

    const emailHtml = await render(
      BookingConfirmationEmail({
        customerName: customer_name,
        bookingReference: booking_reference,
        items: items,
        total: total,
      })
    );

    const options = {
      from: process.env.SMTP_FROM_EMAIL || 'Samba Tours <onboarding@resend.dev>',
      to: customer_email,
      subject: `Booking Confirmation - #${booking_reference}`,
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