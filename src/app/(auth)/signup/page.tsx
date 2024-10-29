"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
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
import AnimatedCircle from "@/components/ui/animiantedCircle";

const SignUpPage = () => {
  const [userName, setUserName] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignInLinkClicked, setIsSignInLinkClicked] = useState(false);
  const debounced = useDebounceCallback(setUserName, 500);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { userName: "", email: "", password: "" },
  });

  useEffect(() => {
    const checkUserName = async () => {
      if (userName) {
        setIsCheckingUserName(true);
        setUserNameMessage("");
        try {
          const response = await axios.get(
            `/api/checkUserName?userName=${userName}`
          );
          setUserNameMessage(response.data.message);
        } catch (error) {
          if (error instanceof AxiosError) {
            const message =
              error.response?.data?.data?.error?.issues?.[0]?.message;
            setUserNameMessage(message);
          }
          setUserNameMessage("Username check error");
        } finally {
          setIsCheckingUserName(false);
        }
      }
    };
    checkUserName();
  }, [userName]);
  const handleSignInLinkClick = () => {
    setIsSignInLinkClicked(true);
    router.push("/signin");
    setIsSignInLinkClicked(false);
  };
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/sign-up`, data);

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${userName}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Failed",
        description: "Sign-up failed. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleMouseMove = (event: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX;
      const y = event.clientY;
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#3B1E54] to-[#387478] text-[#3B1E54] p-6"
    >
      <AnimatedCircle mousePosition={mousePosition} />
      <div className="w-full max-w-lg p-10 bg-[#D4BEE4] rounded-2xl shadow-xl transform transition duration-700 ease-in-out hover:shadow-2xl ">
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-4xl font-extrabold text-[#387478] mb-2 transition-all duration-300">
            Join <span className="text-[#3B1E54]">Be Anonymous</span>
          </h1>
          <p className="text-[#387478]">Start your anonymous journey here.</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-1"
          >
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#3B1E54]">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john123"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      className="border border-[#3B1E54] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A373] transition duration-300 hover:bg-[#f2f2f2]"
                    />
                  </FormControl>
                  {isCheckingUserName && (
                    <LoaderPinwheel className="animate-spin text-[#3B1E54] h-5 w-5 mx-auto mt-2" />
                  )}
                  <p
                    className={`text-sm mt-1 ${
                      userNameMessage === "User name available"
                        ? "text-[#3B1E54]"
                        : "text-red-500"
                    }`}
                  >
                    {userNameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#3B1E54]">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@example.com"
                      {...field}
                      className="border border-[#3B1E54] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A373] transition duration-300 hover:bg-[#f2f2f2]"
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
                  <FormLabel className="text-[#3B1E54]">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="border border-[#3B1E54] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A373] transition duration-300 hover:bg-[#f2f2f2]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-4 bg-[#3B1E54] text-[#D4A373] font-bold py-2 rounded-lg hover:bg-[#3B1E54] hover:scale-105 flex items-center justify-center hover:shadow-lg transition-all duration-300"
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

        <div className="text-center mt-6 flex justify-center gap-3">
          <p className="text-[#387478] flex items-center gap-2">
            Already a member?{" "}
            <Link
              href="/signin"
              onClick={handleSignInLinkClick}
              className="text-[#3B1E54] hover:underline transition-all duration-300 flex items-center gap-1"
            >
              {isSignInLinkClicked ? (
                <LoaderPinwheel className="animate-spin h-5 w-5 inline" />
              ) : (
                "Sign In"
              )}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
