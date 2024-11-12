/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import JWT from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    avatar?: string;
    userName?: string;
    password?: string;
    __v?: number;
  }

  interface Session {
    user: {
      _id?: string;
      isVerified: boolean;
      isAcceptingMessage: boolean;
      avatar?: string;
      userName: string;
    } & DefaultSession["user"];
  }
  interface jwt {
    _id?: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    avatar?: string;
    userName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    avatar?: string;
    userName: string;
  }
}
