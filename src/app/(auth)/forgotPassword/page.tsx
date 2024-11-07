"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoaderPinwheel } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";

const ForgetPasswordPage: React.FC = () => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  // Set up react-hook-form with Zod validation
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: "" },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSendingEmail(true);

    try {
      await axios.post(`/api/forgotPassword`, data);
      toast({
        title: "Email sent! 📧",
        description: "Please check your email for further assistance",
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || "Unable to send email"
          : "An error occurred";
      setMessage(errorMessage);

      console.log(error);
      toast({
        description: "Failed to send email. Try again!",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-br from-[#387478] to-[#3B1E54] p-6">
      <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full p-4 m-4 shadow-lg rounded-md bg-gradient-to-tl from-[#387478]/20 to-[#3B1E54]/30 backdrop-blur-lg">
        {/* Illustration - Display on all screen sizes */}
        <div className="flex items-center justify-center p-4 md:p-8">
          <Image
            src="/static/forgotPassword.gif"
            alt="Forgot Password Illustration"
            width={500}
            height={500}
            className="max-w-full h-auto"
            priority
          />
        </div>

        {/* Password Reset Form */}
        <div className="w-full px-4 py-4 text-center flex flex-col items-center">
          <h1 className="text-[#ecb365] text-4xl font-extrabold mb-4">
            Forgot Password
          </h1>
          <p className="text-sm mb-6 text-gray-300">
            Enter your email or username to receive a password reset link.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">
                      Email or Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john123"
                        {...field}
                        className="border border-gray-600 rounded-lg px-4 py-2 bg-[#1A1A2E] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ecb365] transition duration-300"
                      />
                    </FormControl>
                    {message && (
                      <p className="text-red-500 text-sm mt-1">{message}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full shadow-lg py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-[#ecb365] hover:bg-[#D4A373] focus:outline-none mt-8 transition duration-300"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <LoaderPinwheel className="animate-spin h-10 w-10 mr-2" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
