import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  userName: string;
  verifyCode: string;
}

interface PasswordResetEmailProps {
  userName: string;
  url: string;
}

export const VerificationEmailTemplate = ({
  userName,
  verifyCode,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your account on Be Anonymous</Preview>
      <Body style={sharedStyles.body}>
        <Container style={sharedStyles.container}>
          <Section style={sharedStyles.header}>
            <Heading style={{ fontSize: "24px", color: colors.textPrimary }}>
              Be Anonymous
            </Heading>
            <Text style={{ fontSize: "14px", color: colors.textPrimary }}>
              Welcome to our community, {userName}!
            </Text>
          </Section>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Thank you for signing up on Be Anonymous
          </Text>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: "14px",
              marginTop: "8px",
            }}
          >
            To complete your registration, use the code below to verify your
            email address. This code will expire in 30 minutes.
          </Text>
          <Section
            style={{
              backgroundColor: "rgba(236, 179, 101, 0.2)",
              border: `1px solid ${colors.borderColor}`,
              borderRadius: "8px",
              padding: "16px 24px",
              marginTop: "24px",
            }}
          >
            <Text
              style={{
                fontSize: "28px",
                color: colors.textPrimary,
                fontFamily: "monospace",
              }}
            >
              {verifyCode}
            </Text>
          </Section>
          {/* <Button style={sharedStyles.button} href={`${url}`}>
            Verify Email
          </Button> */}
          <Section style={sharedStyles.footerTextStyle}>
            <Text>Thank you for you signup</Text>
          </Section>

          <Section style={sharedStyles.bottomSectionStyle}>
            <Text style={sharedStyles.copyrightStyle}>
              © {new Date().getFullYear()} Be Anonymous. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const PasswordResetEmailTemplate = ({
  userName,
  url,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Password Reset Request for Be Anonymous</Preview>
      <Body style={sharedStyles.body}>
        <Container style={sharedStyles.container}>
          <Section style={sharedStyles.header}>
            <Heading style={{ fontSize: "24px", color: colors.textPrimary }}>
              Be Anonymous
            </Heading>
            <Text style={{ fontSize: "14px", color: colors.textPrimary }}>
              Hi {userName}, need to reset your password?
            </Text>
          </Section>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            We received a request to reset your password for your Be Anonymous
            account.
          </Text>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: "14px",
              marginTop: "8px",
            }}
          >
            If this was you, click the button below to reset your password. If
            you did not request a password reset, please ignore this email.
          </Text>
          <Button style={sharedStyles.button} href={`${url}`}>
            Reset Password
          </Button>
          <Section style={sharedStyles.footerTextStyle}>
            <Text>Not expecting this email?</Text>
            <Text>
              No worries! Your account is safe, and you can ignore this message.
            </Text>
          </Section>

          <Section style={sharedStyles.bottomSectionStyle}>
            <Text style={sharedStyles.copyrightStyle}>
              © {new Date().getFullYear()} Be Anonymous. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Shared Styles
const colors = {
  background: "#1F4663", // Main background color
  textPrimary: "#ecb365", // Primary text color
  headerBackground: "linear-gradient(-45deg, #064663, #1F4663)", // Gradient for header
  buttonBackground: "#ecb365", // Button color
  borderColor: "#ecb365", // Border color for code container
};

const sharedStyles = {
  body: {
    background: "#cccccc",
    color: colors.textPrimary,
    fontFamily: "Helvetica, Arial, sans-serif",
    textAlign: "center" as const,
  },
  container: {
    backgroundColor: colors.background,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
    borderRadius: "8px",
    maxWidth: "450px",
    margin: "40px auto",
    padding: "24px",
  },
  header: {
    background: colors.headerBackground,
    color: colors.textPrimary,
    borderRadius: "8px 8px 0 0",
    padding: "24px 32px",
    textAlign: "center" as const,
  },
  button: {
    color: colors.background,
    backgroundColor: colors.buttonBackground,
    borderRadius: "50px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold" as const,
    textDecoration: "none" as const,
  },

  footerTextStyle: {
    color: "#ecb365", // Muted gray for secondary text
    fontSize: "14px",
    marginTop: "20px",
  },

  bottomSectionStyle: {
    marginTop: "32px",
  },

  copyrightStyle: {
    fontSize: "12px",
    color: "#999999", // Light gray for a minimalist look
    marginTop: "16px",
  },
};
