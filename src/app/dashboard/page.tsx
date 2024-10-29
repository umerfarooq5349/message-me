"use client";
// import { handleSignOut } from "@/lib/verifyCode";
// import { signOut } from "@/auth";
import { NextPage } from "next";
import { useSession } from "next-auth/react";

const Dashbord: NextPage = ({}) => {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  if (!session?.user) return <p>Not signed in</p>;
  // const handleSignOut = async () => {
  //   await signOut();
  // };
  return (
    <div>
      This is dashbord
      <div className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 wx-5">
        Signed in with {session!.user.email}
      </div>
      <div
        // onClick={handleSignOut}
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 wx-5"
        // onClick={signOut()}
      >
        Sign Out
      </div>
    </div>
  );
};

export default Dashbord;
