"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <Navbar fluid rounded className="bg-[#D4BEE4]/40 backdrop-blur-lg  p-4">
      <Navbar.Brand as={Link} href="/">
        <span className="self-center whitespace-nowrap text-2xl font-extrabold text-[#3B1E54]">
          Be Anonymous
        </span>
      </Navbar.Brand>
      <Navbar.Toggle className="hover:bg-[#3B1E54] text-[#D4A373]" />
      <Navbar.Collapse>
        {session && session.user ? (
          <div className="flex items-center gap-4">
            <Button className="bg-transparent text-[#D4A373] shadow-none font-semibold py-2 px-4 rounded-lg transition-transform transform   hover:bg-transparent  duration-300">
              {/* className="bg-[#3B1E54] text-[#D4A373]  */}
              Welcome, {""}
              <span className="text-[#D4A373]">{session.user.userName}</span>
            </Button>
            <Button
              className="bg-[#3B1E54] text-[#D4A373] shadow-none font-semibold py-2 px-4 rounded-lg transition-transform transform  hover:shadow-lg hover:bg-[#3B1E54] duration-300"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Link
            href="/signin"
            className="bg-[#3B1E54] text-[#D4A373] shadow-none font-semibold py-2 px-4 rounded-lg transition-transform transform  hover:shadow-lg hover:bg-[#3B1E54] duration-300"
          >
            Sign in
          </Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
