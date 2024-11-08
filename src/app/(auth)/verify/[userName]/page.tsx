"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { verifySchema } from "@/schemas/verifySchema";
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
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { LoaderPinwheel } from "lucide-react";
import Image from "next/image";
import React from "react";

interface VerifyUserProps {
  params: Promise<{ userName: string }>;
}

const VerifyUserPage: React.FC<VerifyUserProps> = ({ params }) => {
  const userName = React.use(params).userName;

  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { verifyCode: "" },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsVerifyingCode(true);

    try {
      setIsVerifyingCode(true);

      const response = await axios.post(`/api/verifyUser`, {
        userName,
        verifyCode: data.verifyCode,
      });
      toast({ title: "Congrats! You are verified now" });
      router.replace("/signin");
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
    <div className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-br to-[#3B1E54] from-[#387478] p-6">
      <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-lg rounded-md bg-gradient-to-tl to-[#3B1E54]/30 from-[#387478]/20 backdrop-blur-lg">
        {/* Left Side - Illustration */}
        <div className=" md:flex items-center justify-center p-8">
          <Image
            src="/static/Tablet otp.gif"
            alt="Verification Illustration"
            width={500}
            height={500}
            className="max-w-full h-auto"
            priority
          />
        </div>

        {/* Right Side - Verification Form */}
        <div className="md:max-w-md w-full px-4 py-4 text-center flex flex-col items-center">
          <h1 className="text-[#ecb365] text-4xl font-extrabold mb-4">
            Verify Account
          </h1>
          <p className="text-sm mb-6 text-gray-300">
            Enter the OTP sent to your email to verify,{" "}
            <span className="font-semibold">{userName}</span>.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="verifyCode"
                render={({ field }) => (
                  <FormItem className="flex justify-center flex-col items-center text-center">
                    <FormLabel className="text-gray-400">
                      One-Time Password
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        className="flex gap-2 justify-center"
                      >
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="h-12 w-12 text-center rounded-md text-2xl font-semibold text-[#ecb365] border border-gray-300 focus:ring-2 focus:ring-[#ecb365]"
                          />
                        ))}
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full shadow-lg py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-[#ecb365] hover:bg-[#D4A373] focus:outline-none mt-8 transition duration-300"
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
                verifyMessage === "User verified"
                  ? "text-[#ecb365]"
                  : "text-white"
              }`}
            >
              {verifyMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyUserPage;
