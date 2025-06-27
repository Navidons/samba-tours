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
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationEmailProps {
  customerName?: string;
  bookingReference?: string;
  items?: Array<{
    tour_title: string;
    travel_date: string;
    number_of_guests: number;
    total_price: number;
  }>;
  total?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const BookingConfirmationEmail = ({
  customerName = "Valued Customer",
  bookingReference = "SMBT-12345",
  items = [],
  total = 0,
}: BookingConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Samba Tours Booking Confirmation</Preview>
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
        <Heading style={h1}>Your Booking is Received!</Heading>
        <Text style={text}>
          Hello {customerName},
        </Text>
        <Text style={text}>
          Thank you for booking with Samba Tours & Travel! We have successfully
          received your booking request. We will review the details and contact you
          shortly via your preferred method to finalize the confirmation and
          payment.
        </Text>

        <Section style={box}>
            <Heading as="h2" style={h2}>Booking Summary</Heading>
            <Text style={text}>
                <strong>Booking Reference:</strong> #{bookingReference}
            </Text>
            <Hr style={hr} />
            {items.map((item, index) => (
                <div key={index}>
                    <Heading as="h3" style={itemTitle}>{item.tour_title}</Heading>
                    <Row>
                        <Column style={column}>
                            <Text style={itemText}>Travel Date</Text>
                            <Text style={itemValue}>{new Date(item.travel_date).toLocaleDateString()}</Text>
                        </Column>
                        <Column style={column}>
                            <Text style={itemText}>Guests</Text>
                            <Text style={itemValue}>{item.number_of_guests}</Text>
                        </Column>
                        <Column style={{...column, textAlign: 'right'}}>
                            <Text style={itemText}>Subtotal</Text>
                            <Text style={itemValue}>${item.total_price.toFixed(2)}</Text>
                        </Column>
                    </Row>
                    {index < items.length - 1 && <Hr style={hr} />}
                </div>
            ))}
             <Hr style={hr} />
            <Row>
                <Column>
                    <Text style={totalText}>Total Amount</Text>
                </Column>
                <Column style={{textAlign: 'right'}}>
                    <Text style={totalValue}>${total.toFixed(2)}</Text>
                </Column>
            </Row>
        </Section>

        <Text style={text}>
          If you have any immediate questions, feel free to contact our support
          team at <a href="mailto:support@sambatuors.com">support@sambatuors.com</a>.
        </Text>
        <Text style={text}>We look forward to adventuring with you!</Text>
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

export default BookingConfirmationEmail;

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

const h2 = {
    color: '#1d3557',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
}

const text = {
  color: "#457b9d",
  fontSize: "16px",
  lineHeight: "26px",
  padding: '0 20px',
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#e63946",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
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

const itemTitle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1d3557',
    margin: '0 0 10px 0'
}

const itemText = {
    fontSize: '14px',
    color: '#457b9d',
    margin: 0,
}

const itemValue = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1d3557',
    margin: 0,
}

const totalText = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1d3557',
    margin: '10px 0 0 0',
}

const totalValue = {
    ...totalText,
    color: '#2a9d8f'
}

const column = {
    width: '33%',
} 