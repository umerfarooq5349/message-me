"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { LoaderPinwheel } from "lucide-react";
import { useRouter } from "next/navigation";

function VerifyUserPage({ params }: { params: { userName: string } }) {
  const userName = React.use(
    params as unknown as Promise<{ userName: string }>
  ).userName;

  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { verifyCode: "" },
  });

  const onsubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsVerifyingCode(true);

      const response = await axios.post(`/api/verifyUser`, {
        userName,
        verifyCode: data.verifyCode,
      });
      toast({ title: "Congrats! You are verified now" });
      router.replace("/");
      setVerifyMessage(response.data.message);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const verifyError =
          error.response?.data?.data?.error?.issues?.[0]?.message ||
          error.response?.data?.message;
        toast({ description: verifyError, variant: "destructive" });
        setVerifyMessage(verifyError);
      }
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#3B1E54] to-[#387478] p-6">
      <div className="w-full max-w-md p-10 bg-[#D4BEE4] rounded-2xl shadow-xl transition-transform transform  hover:shadow-2xl relative text-center">
        <h1 className="text-4xl font-bold text-[#3B1E54] mb-2 transition-all duration-300">
          Verify Your Account
        </h1>
        <p className="text-[#387478] mb-6">
          Hey {userName}, Please enter the OTP sent to your email to complete
          your registration.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onsubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#387478]">
                    One-Time Password
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      className="flex gap-2 justify-center"
                    >
                      {Array.from({ length: 6 }, (_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-12 text-center rounded-md text-2xl font-semibold text-[#3B1E54] border border-[#387478] transition-all duration-300 focus:ring-2 focus:ring-[#D4A373]"
                        />
                      ))}
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-[#387478] mt-4">
                    Please check spam folder if didn&lsquo;t recive yet.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#3B1E54] text-[#D4A373] font-bold py-3 rounded-lg hover:bg-[#3B1E54] transition-all duration-300 hover:shadow-lg"
              disabled={isVerifyingCode}
            >
              {isVerifyingCode ? (
                <LoaderPinwheel className="animate-spin h-10 w-10 mr-2" />
              ) : (
                "Verify code"
              )}
            </Button>
          </form>
        </Form>

        {verifyMessage && (
          <p
            className={`mt-6 text-center ${
              verifyMessage === "User varified"
                ? "text-[#3B1E54]"
                : "text-red-500"
            }`}
          >
            {verifyMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyUserPage;
