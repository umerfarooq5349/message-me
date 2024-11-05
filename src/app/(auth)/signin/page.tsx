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
// import AnimatedCircle from "@/components/animiantedCircle";
import { signIn } from "next-auth/react";
import { signinSchema } from "@/schemas/signInSchema";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isGoogleSubmiting, setIsGoogleSubmiting] = useState(false);
  // const [isInstagramSubmiting, setIsInstagramSubmiting] = useState(false);
  const [isSignUpLinkClicked, setIsSignUpLinkClicked] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { identifier: "", password: "" },
    mode: "onChange", // validates on change
  });

  const { isDirty, isValid } = form.formState;

  // Update isDisabled based on form validation
  const isDisabled = !isDirty || !isValid;

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    // setIsGoogleSubmiting(false);
    // setIsInstagramSubmiting(false);
    try {
      const result = await signIn("credentials", { ...data, redirect: false });
      if (result?.error) {
        console.log(result);
        setLoginError("Invalid email or password");
        toast({
          title: "Failed",
          description: "Invalid email or password",
        });
      } else {
        router.push("/dashboard");
        toast({
          title: "Sign In successfull",
          description: "Welcome back again",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Failed",
        description: "Sign in failed. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleInstagramSignin = async () => {
  //   setIsInstagramSubmiting(true);
  //   try {
  //     await signIn("instagram");
  //   } finally {
  //     setIsSubmitting(false);
  //     setIsGoogleSubmiting(false);
  //     setIsInstagramSubmiting(false);
  //   }
  // };

  const handleSignUpLinkClick = () => {
    setIsSignUpLinkClicked(true);
    router.push("/signup");
    setIsSignUpLinkClicked(false);
  };

  // const handleGoogleSignin = async () => {
  //   setIsGoogleSubmiting(true);
  //   try {
  //     await signIn("google");
  //   } finally {
  //     setIsSubmitting(false);
  //     setIsGoogleSubmiting(false);
  //     setIsInstagramSubmiting(false);
  //   }
  // };

  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const containerRef = useRef<HTMLDivElement | null>(null);
  // const handleMouseMove = (event: MouseEvent) => {
  //   const rect = containerRef.current?.getBoundingClientRect();
  //   if (rect) {
  //     const x = event.clientX;
  //     const y = event.clientY;
  //     setMousePosition({ x, y });
  //   }
  // };

  // useEffect(() => {
  //   const currentContainer = containerRef.current;
  //   if (currentContainer) {
  //     currentContainer.addEventListener("mousemove", handleMouseMove);
  //   }
  //   return () => {
  //     if (currentContainer) {
  //       currentContainer.removeEventListener("mousemove", handleMouseMove);
  //     }
  //   };
  // }, []);

  return (
    <div
      // ref={containerRef}
      className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#3B1E54] to-[#387478] text-[#3B1E54] p-6"
    >
      {/* <AnimatedCircle mousePosition={mousePosition} /> */}
      <div className="w-full max-w-lg p-10 bg-[#D4BEE4] rounded-2xl shadow-xl transform transition duration-700 ease-in-out hover:shadow-2xl ">
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-4xl font-extrabold text-[#3B1E54] mb-2 transition-all duration-300">
            Happy to see you again
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
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#3B1E54]">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
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
                  <p className="text-red-500"> {loginError}</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-4 bg-[#3B1E54] text-[#D4A373] font-bold py-2 rounded-lg hover:bg-[#3B1E54] hover:scale-105 flex items-center justify-center hover:shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
              disabled={isSubmitting || isDisabled}
            >
              {isSubmitting ? (
                <LoaderPinwheel className="animate-spin h-5 w-5 mr-2" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        {/* <p className="text-center text-sm my-2">Or sign in with</p> */}
        {/* <div className="flex flex-row gap-3 ">
          <Button
            onClick={handleGoogleSignin}
            className="w-full bg-[#3B1E54] text-[#D4A373] font-bold py-2 rounded-lg hover:bg-[#3B1E54] hover:scale-105 flex items-center justify-center hover:shadow-lg transition-all duration-300"
          >
            {isGoogleSubmiting ? (
              <LoaderPinwheel className="animate-spin h-5 w-5 mr-2" />
            ) : (
              "Sign In with Google"
            )}
          </Button>

          <Button
            onClick={handleInstagramSignin}
            className="w-full bg-[#3B1E54] text-[#D4A373] font-bold py-2 rounded-lg hover:bg-[#3B1E54] hover:scale-105 flex items-center justify-center hover:shadow-lg transition-all duration-300"
          >
            {isInstagramSubmiting ? (
              <LoaderPinwheel className="animate-spin h-5 w-5 mr-2" />
            ) : (
              "Sign In with Instagram"
            )}
          </Button>
        </div> */}

        <div className="text-center mt-6 flex justify-center gap-3">
          <p className="text-[#387478] flex items-center gap-2">
            Not a member yet?{" "}
            <Link
              href="/signup"
              onClick={handleSignUpLinkClick}
              className="text-[#3B1E54] hover:underline transition-all duration-300 flex items-center gap-1"
            >
              {isSignUpLinkClicked ? (
                <LoaderPinwheel className="animate-spin h-5 w-5 inline" />
              ) : (
                "Sign Up"
              )}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
