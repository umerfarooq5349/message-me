import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { UserModel } from "./models/user";
import dbConnect from "./lib/dbConnect";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          await dbConnect();
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { userName: credentials.identifier },
            ],
          });

          if (
            !user ||
            !(await bcrypt.compare(
              credentials.password!.toString(),
              user.password
            ))
          ) {
            throw new Error("Invalid credentials");
          }

          // Convert user document to plain object and ensure _id is a string
          return {
            ...user.toObject(),
            _id: user._id!.toString(),
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id ?? token._id;
        token.isVerified = user.isVerified ?? token.isVerified;
        token.isAcceptingMessage =
          user.isAcceptingMessage ?? token.isAcceptingMessage;
        token.userName = user.userName ?? token.userName;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          _id: token._id,
          isVerified: token.isVerified,
          isAcceptingMessage: token.isAcceptingMessage,
          userName: token.userName,
        };
      }
      return session;
    },
  },
});
