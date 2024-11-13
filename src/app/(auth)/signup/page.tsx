"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
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
import { Input } from "@/components/ui/input";
import { LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SignUpPage = () => {
  const [userName, setUserName] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { userName: "", email: "", password: "" },
  });

  // Debounced username change handler
  const debouncedSetUserName = useDebounceCallback(setUserName, 500);

  useEffect(() => {
    const checkUserNameAvailability = async () => {
      if (!userName) return; // Skip if no username input

      setIsCheckingUserName(true);
      setUserNameMessage("");

      try {
        const response = await axios.get(
          `/api/checkUserName?userName=${userName}`
        );
        setUserNameMessage(response.data.message);
      } catch (error) {
        console.log(error);
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.data?.error.issues[0].message ||
              "Username check error"
            : "An error occurred";
        setUserNameMessage(errorMessage);
      } finally {
        setIsCheckingUserName(false);
      }
    };

    checkUserNameAvailability();
  }, [userName]);

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/sign-up`, data);
      toast({ title: "Success", description: response.data.message });
      router.replace(`/verify/${data.userName}`);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || "Sign-up failed. Please try again."
          : "An unexpected error occurred";
      toast({ title: "Error", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-br to-[#3B1E54] from-[#387478] p-6">
      <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-lg rounded-md bg-[#0D1B2A]/30 backdrop-blur-lg">
        {/* Left Side - Sign Up Form */}
        <div className="md:max-w-md w-full order-1 md:order-2 px-4 py-4">
          <h3 className="text-[#ecb365] text-4xl font-extrabold">Sign Up</h3>
          <p className="text-sm mt-4 text-gray-300">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#D4A373] font-semibold hover:underline"
            >
              Sign in here
            </Link>
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
            >
              {/* Username Field */}
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john123"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedSetUserName(e.target.value);
                        }}
                        className="border border-gray-600 rounded-lg px-4 py-2 bg-[#1A1A2E] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ecb365] transition duration-300"
                      />
                    </FormControl>
                    {isCheckingUserName && (
                      <LoaderPinwheel className="animate-spin text-[#ecb365] h-5 w-5 mx-auto mt-2" />
                    )}
                    <p
                      className={`text-sm mt-1 ${
                        userNameMessage === "User name available"
                          ? "text-[#ecb365]"
                          : "text-red-500"
                      }`}
                    >
                      {userNameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                        className="w-full text-gray-300 text-sm bg-[#1A1A2E] border-b border-[#387478] focus:border-[#ecb365] px-2 py-3 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="w-full text-gray-300 text-sm bg-[#1A1A2E] border-b border-[#387478] focus:border-[#ecb365] px-2 py-3 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full shadow-lg py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-[#ecb365] hover:bg-[#D4A373] focus:outline-none mt-8 transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderPinwheel className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Right Side - Illustration */}
        <div className=" md:flex items-center justify-center p-8">
          <Image
            src="/static/Tablet signup.gif"
            alt="Welcome Illustration"
            width={500}
            height={500}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
