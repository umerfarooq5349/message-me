import NextAuth from "next-auth";

// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import type { NextAuthConfig } from "next-auth";

// import Google from "next-auth/providers/google";
// import Facebook from "next-auth/providers/facebook";
// import Instagram from "next-auth/providers/instagram";
// import Resend from "next-auth/providers/resend";

import bcrypt from "bcryptjs";

import Credentials from "next-auth/providers/credentials";

import dbConnect from "./lib/dbConnect";
import { UserModel } from "./models/user";

// import authConfig from "./auth.config";
// import mongoClient from "./lib/db";
// import dbConnect from "./lib/dbConnect";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: MongoDBAdapter(mongoClient),
  providers: [
    // Google({
    //   clientId: process.env.AUTH_GOOGLE_ID,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET,
    // }),
    // Facebook({
    //   clientId: process.env.AUTH_FACEBOOK_ID,
    //   clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    // }),
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
          user = await UserModel.findOne({ email: credentials.identifier });
          if (
            !user ||
            !(await bcrypt.compare(
              credentials.password!.toString(),
              user.password
            ))
          ) {
            throw new Error("Invalid credentials");
          }
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
  // session: { strategy: "jwt" },
  // debug: true,
  secret: process.env.AUTH_SECRET,
  //   pages: { signIn: "/signIn" },

  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // async signIn({ user, account, profile }) {
    //   if (account!.provider === "instagram") {
    //     console.log("login with facebook");
    //     console.log(user);
    //   }
    //   if (account!.provider === "google") {
    //     console.log("login with google.image");
    //     console.log(user);
    //   }
    //   return true;
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
