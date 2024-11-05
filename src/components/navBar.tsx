"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export function NavBar() {
  const { data: session } = useSession();
  const pathName = usePathname();
  console.log(pathName);
  return (
    <Navbar
      rounded
      className="bg-[#D4BEE4]/60 fixed w-5/6  z-50  mx-auto backdrop-blur-md shadow-lg p-4 rounded-b-xl border border-[#D4A373]/20"
    >
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-2xl font-extrabold text-[#3B1E54]">
          Be Anonymous
        </span>
      </Navbar.Brand>
      <Navbar.Toggle className="hover:bg-[#3B1E54] text-[#D4A373]" />
      <Navbar.Collapse>
        {session && session.user ? (
          <div className="flex items-center gap-4">
            <Button className="bg-transparent text-[#3B1E54] font-semibold py-2 px-4 rounded-lg transition-transform transform hover:bg-transparent shadow-none hover:shadow-none hover:cursor-auto duration-300">
              Welcome,{" "}
              <span className="text-[#3B1E54]">{session.user.userName}</span>
            </Button>
            <Button
              className="bg-[#3B1E54] text-[#D4A373] font-semibold py-2 px-4 rounded-lg transition-transform transform hover:bg-[#3B1E54] hover:text-white hover:shadow-md duration-300"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div>
            {pathName.startsWith("/user/") ? (
              <Link
                href="/signup"
                className="bg-[#3B1E54] text-[#D4A373] font-semibold py-2 px-4 rounded-lg transition-transform transform hover:bg-[#3B1E54] hover:text-white hover:shadow-md duration-300"
              >
                Signup to recive messages
              </Link>
            ) : (
              <Link
                href="/signin"
                className="bg-[#3B1E54] text-[#D4A373] font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-md duration-300"
              >
                Signin
              </Link>
            )}
          </div>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
