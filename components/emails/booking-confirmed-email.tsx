import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Heading,
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmedEmailProps {
  customerName?: string;
  bookingReference?: string;
  bookingDate?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const BookingConfirmedEmail = ({
  customerName = "Valued Customer",
  bookingReference = "SMBT-12345",
  bookingDate = new Date().toLocaleDateString(),
}: BookingConfirmedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Samba Tours Booking is Confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${baseUrl}/placeholder-logo.png`}
            width="150"
            height="auto"
            alt="Samba Tours"
            style={logo}
          />
        </Section>
        <Heading style={h1}>Your Booking is Confirmed!</Heading>
        <Text style={text}>
          Hello {customerName},
        </Text>
        <Text style={text}>
          Great news! We are pleased to inform you that your booking with Samba Tours & Travel has been officially confirmed.
        </Text>

        <Section style={box}>
            <Text style={detailsText}>
                <strong>Booking Reference:</strong> #{bookingReference}
            </Text>
            <Text style={detailsText}>
                <strong>Booking Date:</strong> {bookingDate}
            </Text>
        </Section>
        
        <Text style={text}>
            Our team is now making all the necessary arrangements for your upcoming tour. If you have any questions or need to make any changes, please don't hesitate to contact us.
        </Text>
        <Text style={text}>
          We look forward to providing you with an unforgettable experience!
        </Text>
        <Text style={text}>
          Best regards,
          <br />
          The Samba Tours & Travel Team
        </Text>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            Samba Tours & Travel, Kampala, Uganda
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default BookingConfirmedEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #f0f0f0",
  borderRadius: "4px",
};

const logoContainer = {
    padding: '0 20px',
    textAlign: 'center' as const,
    marginBottom: '20px',
}

const logo = {
  margin: "0 auto",
};

const h1 = {
  color: "#1d3557",
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px 0",
};

const text = {
  color: "#457b9d",
  fontSize: "16px",
  lineHeight: "26px",
  padding: '0 20px',
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: '15px'
};

const footerText = {
    ...footer,
    padding: '0 20px',
}

const box = {
    padding: '20px',
    margin: '0 20px',
    border: '1px solid #f0f0f0',
    borderRadius: '4px',
}

const detailsText = {
  ...text,
  padding: 0,
  margin: '0 0 10px 0',
} 