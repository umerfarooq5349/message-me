"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, Suspense } from "react";
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
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { useRouter, useSearchParams } from "next/navigation";
import BikeAnimation from "@/components/bikeAnimiation";

const PasswordResetPage: React.FC = () => {
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const [verifyingResetLink, setVerifyingResetLink] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const getResetToken = async () => {
      setVerifyingResetLink(true);
      const resetToken = searchParams.get("resetToken");
      if (resetToken) {
        try {
          const response = await axios.post("/api/resetPassword", {
            resetToken,
          });
          toast({
            title: "Verified",
            description: response.data.message,
            variant: "default",
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof AxiosError
              ? error.response?.data?.message || "Reset link not verified."
              : error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          setMessage(errorMessage);
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setVerifyingResetLink(false);
        }
      }
    };
    getResetToken();
  }, [searchParams, toast]);

  // Set up react-hook-form with Zod validation
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    const resetToken = searchParams.get("resetToken");

    if (!resetToken) {
      setMessage("Reset token is missing.");
      return;
    }

    setIsSettingNewPassword(true);
    try {
      const response = await axios.post(`/api/resetPassword`, {
        resetToken,
        ...data,
      });
      toast({
        title: "Password changed",
        description: "Visit the sign-in page to sign in.",
      });
      console.log(response);
      router.replace("/signin");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || "Unable to set new password"
          : "An error occurred";
      setMessage(errorMessage);

      console.log(error);
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSettingNewPassword(false);
    }
  };

  return (
    <Suspense>
      <div className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-br from-[#387478] to-[#3B1E54] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl w-full p-4 m-4 shadow-lg rounded-md bg-gradient-to-tl from-[#387478]/20 to-[#3B1E54]/30 backdrop-blur-lg">
          {/* Illustration - Display on top for small screens */}
          <div className="flex items-center justify-center p-4 sm:order-last md:p-8">
            <Image
              src="/static/resetPassword.gif"
              alt="Password Reset Illustration"
              width={500}
              height={500}
              className="max-w-5/6 h-auto"
              priority
            />
          </div>

          {verifyingResetLink ? (
            <div className="w-full px-4 py-4 text-center flex flex-col justify-center items-center">
              <BikeAnimation
                text={"Verifying reset link"}
                textColor="text-[#D4A373]"
                tireColor="#D4BEE4"
                pedalColor="#ecb365"
                bodyColor="text-[#D4BEE4]"
              />
            </div>
          ) : (
            <div className="w-full px-4 py-4 text-center flex flex-col justify-center items-center">
              <h1 className="text-[#ecb365] text-4xl font-extrabold mb-4">
                Reset Password
              </h1>
              <p className="text-sm mb-6 text-gray-300">
                Enter your new password.
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-4/6 space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">
                          New password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            className="border border-gray-600 rounded-lg px-4 py-2 bg-[#1A1A2E] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ecb365] transition duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">
                          Confirm password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
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
                    disabled={
                      isSettingNewPassword ||
                      !form.formState.isValid ||
                      !!message
                    }
                  >
                    {isSettingNewPassword ? (
                      <LoaderPinwheel className="animate-spin h-10 w-10 mr-2" />
                    ) : (
                      "Set new password"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default PasswordResetPage;
