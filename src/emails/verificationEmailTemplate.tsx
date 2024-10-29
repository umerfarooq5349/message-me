// components/VerificationEmail.tsx

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  userName: string;
  verifyCode: string;
}

const VerificationEmailTemplate = ({
  userName,
  verifyCode,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your account on Be Anonymous</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Container style={imageContainerStyle}>
              <Img
                src={`/static/be-anonymous.png`}
                width="80"
                height="80"
                alt="Be Anonymous"
                style={imageStyle}
              />
            </Container>
            <Heading style={headingStyle}>Be Anonymous</Heading>
            <Text style={subTextStyle}>
              Welcome to our community, {userName}!
            </Text>
          </Section>
          <Text style={mainTextStyle}>
            Thank you for signing up on Be Anonymous
          </Text>
          <Text style={descriptionStyle}>
            To complete your registration, use the code below to verify your
            email address. This code will expire in 30 minutes.
          </Text>
          <Section style={codeContainerStyle}>
            <Text style={codeStyle}>{verifyCode}</Text>
          </Section>
          <Section style={dividerStyle}></Section>
          <Text style={footerTextStyle}>Not expecting this email?</Text>
          <Text style={footerTextStyle}>
            Simply ignore this message if it wasn’t you.
          </Text>
          <Section style={bottomSectionStyle}>
            <Text style={copyrightStyle}>
              © {new Date().getFullYear()} Be Anonymous. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmailTemplate;

// Styles
const bodyStyle = {
  // background: "#04293a", // Dark background for dark mode
  color: "#ecb365", // Original text color
  fontFamily: "Helvetica, Arial, sans-serif",
  textAlign: "center" as const,
};

const containerStyle = {
  backgroundColor: "#1F4663", // Darker container background
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
  borderRadius: "8px",
  maxWidth: "450px",
  margin: "40px auto",
  padding: "24px",
};

const headerStyle = {
  background: "linear-gradient(-45deg, #064663, #1F4663)", // Gradient for header
  color: "#ecb365", // Text color for the header
  borderRadius: "8px 8px 0 0",
  padding: "24px 32px",
  marginBottom: "16px",
  textAlign: "center" as const,
};

const imageContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "16px",
};

const imageStyle = {
  display: "block",
  margin: "0 auto",
};

const headingStyle = {
  color: "#ecb365", // Maintained heading color
  fontSize: "24px",
  fontWeight: "bold" as const,
};

const subTextStyle = {
  fontSize: "14px",
  color: "#ecb365", // Maintained subheading color
  fontWeight: "300" as const,
  marginTop: "8px",
};

const mainTextStyle = {
  color: "#ecb365", // Main text color
  fontSize: "18px",
  fontWeight: "600" as const,
  marginTop: "16px",
};

const descriptionStyle = {
  color: "#ecb365", // Description text color
  fontSize: "14px",
  marginTop: "8px",
};

const codeContainerStyle = {
  backgroundColor: "rgba(236, 179, 101, 0.2)", // Lightened background for the code section
  border: "1px solid #ecb365", // Original border color
  borderRadius: "8px",
  marginTop: "24px",
  padding: "16px 24px",
  width: "260px",
  margin: "24px auto",
};

const codeStyle = {
  color: "#ecb365", // Original code color
  fontSize: "28px",
  fontFamily: "monospace",
  letterSpacing: "4px",
  fontWeight: "bold" as const,
};

const dividerStyle = {
  borderTop: "1px solid rgba(236, 179, 101, 0.3)", // Light divider color
  marginTop: "24px",
};

const footerTextStyle = {
  color: "#ecb365", // Footer text color
  fontSize: "14px",
  marginTop: "24px",
};

const bottomSectionStyle = {
  marginTop: "32px",
};

const copyrightStyle = {
  fontSize: "12px",
  color: "#cccccc", // Lightened copyright color for readability
};
