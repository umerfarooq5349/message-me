"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
import { signIn } from "next-auth/react";
import { signinSchema } from "@/schemas/signInSchema";
import Image from "next/image";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { identifier: "", password: "" },
    mode: "onChange",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isDirty, isValid } = form.formState;
  const isDisabled = isSubmitting || !isValid;

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    setLoginError("");
    try {
      const result = await signIn("credentials", { ...data, redirect: false });
      if (!result) {
        toast({
          title: "Sign In Error",
          description: "An unexpected error occurred. Please try again.",
        });
      } else if (result.error) {
        setLoginError("Invalid credentials");
        toast({
          title: "Sign In Failed",
          description: "Please check your credentials.",
        });
      } else {
        toast({
          title: "Welcome Back!",
          description: "Sign in successful!",
        });
        router.replace("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Sign In Error",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-br to-[#3B1E54] from-[#387478] p-6">
      <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full p-4 m-4 shadow-lg rounded-md bg-[#0D1B2A]/30 backdrop-blur-lg">
        <div className="flex items-center justify-center p-8 order-1 md:order-2">
          <Image
            src="/static/Tablet login.gif"
            alt="Welcome Illustration"
            width={500}
            height={500}
            className="max-w-4/6 h-auto"
            priority
          />
        </div>
        <div className="md:max-w-md w-full px-4 py-4 order-2 md:order-1">
          <h3 className="text-[#ecb365] text-4xl font-extrabold">Sign in</h3>
          <p className="text-sm mt-4 text-gray-300">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#D4A373] font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-sm">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter email"
                        {...field}
                        className="w-full text-gray-300 text-sm bg-[#1A1A2E] border-b border-[#387478] focus:border-[#ecb365] px-2 py-3 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        autoComplete="current-password"
                        {...field}
                        className="w-full text-gray-300 text-sm bg-[#1A1A2E] border-b border-[#387478] focus:border-[#ecb365] px-2 py-3 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginError && (
                <p className="text-red-500 text-xs mt-2">{loginError}</p>
              )}

              <div className="flex items-center justify-between mt-4">
                <Link
                  href="/forgotPassword"
                  className="text-sm font-semibold text-[#D4A373] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full shadow-lg py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-[#ecb365] hover:bg-[#D4A373] focus:outline-none mt-8 transition duration-300"
                disabled={isDisabled}
              >
                {isSubmitting ? (
                  <LoaderPinwheel className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
