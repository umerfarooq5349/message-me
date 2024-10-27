"use  client";
// import { signIn } from "@/auth";
import Link from "next/link";

function Signin() {
  //   const handleclick = async () => {
  //     await signIn();
  //   };

  return (
    <div>
      <Link
        href={"/api/auth/signin"}
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        // onClick={handleclick}
      >
        Signin
      </Link>
    </div>
  );
}

export default Signin;
