import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { UserModel } from "./models/Message";
import bcrypt from "bcryptjs";
import { NextAuthConfig, User } from "next-auth";
// import dbConnect from "./lib/dbConnect";
// import { UserModel } from "./models/Message";
// import bcrypt from "bcryptjs";
// import type { NextAuthConfig, Session } from "next-auth";
// import { JWT } from "next-auth/jwt";
// // import { Session } from "next-auth/core/types";

// // Type for user object returned from Mongoose
// interface CustomUser {
//   _id: string;
//   isVerified: boolean;
//   isAcceptingMessage: boolean;
//   userName: string;
// }

// // Modularized callback functions for cleaner code
// const jwtCallback = async ({
//   token,
//   user,
// }: {
//   token: JWT;
//   user?: CustomUser;
// }) => {
//   if (user) {
//     token._id = user._id;
//     token.isVerified = user.isVerified;
//     token.isAcceptingMessage = user.isAcceptingMessage;
//     token.userName = user.userName;
//   }
//   return token;
// };

// const sessionCallback = async ({
//   session,
//   token,
// }: {
//   session: Session;
//   token: JWT;
// }) => {
//   if (token) {
//     session.user = {
//       ...session.user,
//       _id: token._id as string,
//       isVerified: token.isVerified as boolean,
//       isAcceptingMessage: token.isAcceptingMessage as boolean,
//       userName: token.userName as string,
//     };
//   }
//   return session;
// };

// // Main auth configuration
// const authConfig: NextAuthConfig = {
//   providers: [
//     Credentials({
//       credentials: {
//         identifier: {
//           label: "Email",
//           type: "email",
//           placeholder: "example@example.com",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         await dbConnect();
//         const user = await UserModel.findOne({
//           email: credentials?.identifier,
//         });

//         if (
//           !user ||
//           !(await bcrypt.compare(
//             credentials?.password!.toString(),
//             user.password
//           ))
//         ) {
//           throw new Error("Invalid credentials");
//         }

//         return { ...user.toObject(), _id: user._id!.toString() }; // Ensure _id is a string
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: { strategy: "jwt" },
//   callbacks: {
//     jwt: jwtCallback,
//     session: sessionCallback,
//   },
// };

// export default authConfig;

async function getUser(identifier: string): Promise<User | null> {
  try {
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (user) {
      return {
        _id: user._id!.toString(), // Ensure _id is a string
        isVerified: user.isVerified,
        isAcceptingMessage: user.isAcceptingMessages,
        userName: user.userName,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            identifier: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { identifier, password } = parsedCredentials.data;
          const user = await getUser(identifier);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password!);

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
