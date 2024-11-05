import NextAuth from "next-auth";

// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import type { NextAuthConfig } from "next-auth";
// import Google from "next-auth/providers/google";
// import Facebook from "next-auth/providers/facebook";
// import Instagram from "next-auth/providers/instagram";
// import Resend from "next-auth/providers/resend";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { UserModel } from "./models/user";
// import dbConnect from "./lib/dbConnect";
// import authConfig from "./auth.config";
// import mongoClient from "./lib/db";
import dbConnect from "./lib/dbConnect";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: MongoDBAdapter(mongoClient),
  providers: [
    // Google,
    // Facebook,
    // Instagram,
    // Resend,
    Credentials({
      credentials: {
        identifier: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        try {
          await dbConnect();
          let user = null;
          console.log(credentials);
          user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { userName: credentials.identifier },
            ],
          });
          if (
            !user ||
            !(await bcrypt.compare(
              credentials.password!.toString(),
              user.password!
            ))
          ) {
            throw new Error("Invalid credentials");
          }
          // if (!user.isVerified) {
          //   await sendVerificationEmail(user.userName, verifyCode, user.email);
          //   throw new Error("Please verify your email first");
          // }

          // Overwrite the _id field to explicitly define it as a string
          const typedUser = {
            ...user.toObject(), // Convert the Mongoose user document to plain object
            _id: user._id!.toString(), // Ensure _id is a string
          };

          return typedUser; // Return the correctly typed user object
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },

      // async authorize(credentials) {

      // },
    }),
  ],
  session: { strategy: "jwt" },
  // debug: true,
  secret: process.env.AUTH_SECRET,
  // pages: { signIn: "/signin" },

  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // async signIn({ user, account, profile }) {
    //   try {
    //     console.log("Sign-in callback triggered");

    //     // If the account provider is not credentials, we treat it as a social login
    //     if (
    //       account?.provider === "google" ||
    //       account?.provider === "instagram" ||
    //       account?.provider === "facebook"
    //     ) {
    //       console.log("Using social provider:", account?.provider);

    //       await dbConnect();
    //       console.log(profile);

    //       // Check if user already exists
    //       const existingUser = await UserModel.findOne({ email: user.email });
    //       console.log("Existing user found:", existingUser);

    //       if (existingUser) {
    //         console.log("User already exists, skipping creation.");
    //         return true; // User exists, continue sign-in
    //       }

    //       // If user doesn’t exist, create a new one
    //       console.log("Creating new user for social login");

    //       const newUser = new UserModel({
    //         profilePic: user.image,
    //         email: user.email,
    //         userName: user.name || `user_${verifyCode}`,
    //         verifyCode,
    //         verifyCodeExpiry: verifyCodeExpiryTime,
    //         isVerified: profile!.email_verified,
    //         authType: account.provider,
    //       });

    //       await newUser.save();

    //       console.log("New user created:", newUser);
    //     } else {
    //       console.log("Sign-in with credentials provider.");
    //     }

    //     return true; // Allow sign-in
    //   } catch (error) {
    //     console.error("Error during sign-in callback:", error);
    //     return false; // Deny sign-in on error
    //   }
    // },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id!;
        token.isVerified = user.isVerified!;
        token.isAcceptingMessage = user.isAcceptingMessage!;
        token.userName = user.userName!;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.userName = token.userName;
      }
      return session;
    },
  },
});
