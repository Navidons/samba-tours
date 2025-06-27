import {
  Body,
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
  Column
} from "@react-email/components";
import * as React from "react";

interface PaymentConfirmationEmailProps {
  customerName?: string;
  bookingReference?: string;
  paymentDate?: string;
  paymentAmount?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const PaymentConfirmationEmail = ({
  customerName = "Valued Customer",
  bookingReference = "SMBT-12345",
  paymentDate = new Date().toLocaleDateString(),
  paymentAmount = 0
}: PaymentConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Payment Received - Thank You!</Preview>
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
        <Heading style={h1}>Thank You for Your Payment!</Heading>
        <Text style={text}>
          Hello {customerName},
        </Text>
        <Text style={text}>
          This email confirms that we have successfully received your payment. Your booking is now fully paid and confirmed.
        </Text>

        <Section style={box}>
          <Heading as="h2" style={h2}>Payment Details</Heading>
            <Row style={row}>
                <Column>
                    <Text style={detailsText}>Booking Reference:</Text>
                </Column>
                <Column style={{textAlign: 'right'}}>
                    <Text style={detailsValue}>#{bookingReference}</Text>
                </Column>
            </Row>
             <Row style={row}>
                <Column>
                    <Text style={detailsText}>Payment Date:</Text>
                </Column>
                <Column style={{textAlign: 'right'}}>
                    <Text style={detailsValue}>{paymentDate}</Text>
                </Column>
            </Row>
             <Row style={row}>
                <Column>
                    <Text style={detailsText}>Amount Paid:</Text>
                </Column>
                <Column style={{textAlign: 'right'}}>
                    <Text style={totalValue}>${paymentAmount.toFixed(2)}</Text>
                </Column>
            </Row>
        </Section>
        
        <Text style={text}>
            We are thrilled to have you and are finalizing all the details for your tour. You will receive further information about your itinerary soon.
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

export default PaymentConfirmationEmail;

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

const row = {
    margin: '0 0 10px 0',
}

const detailsText = {
  fontSize: '14px',
  color: '#457b9d',
  margin: 0,
}

const detailsValue = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#1d3557',
  margin: 0,
}

const totalValue = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2a9d8f'
} 