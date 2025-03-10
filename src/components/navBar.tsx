"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import Alert from "./alert";
import { LogInIcon } from "lucide-react";

export function NavBar() {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  return (
    <Navbar
      rounded
      className="bg-[#D4BEE4]/60 fixed w-5/6  z-50  mx-auto backdrop-blur-md shadow-lg p-4 rounded-b-xl border border-[#D4A373]/20"
    >
      <Navbar.Brand as={Link} href="/">
        <span className="self-center whitespace-nowrap text-2xl font-extrabold text-[#3B1E54]">
          Be Anonymous
        </span>
      </Navbar.Brand>
      <Navbar.Toggle className="hover:bg-[#3B1E54] text-[#D4A373]" />
      <Navbar.Collapse>
        {session && session.user ? (
          <div className="flex items-center gap-4">
            <Button
              className="bg-[#3B1E54] text-[#ecb365] rounded-lg px-4 py-2 transition duration-200 hover:bg-[#340e56] hover:text-white"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Dashoard
              {/* Welcome,{" "}
              <span className="text-[#3B1E54]">{session.user.userName}</span> */}
            </Button>

            <Alert
              description="Are you sure? You want to sign out?"
              title="Sign out"
              triggerText="Sign out"
              onConfirm={() => signOut()}
            />
            {/* <Button
              className="bg-[#3B1E54] text-[#D4A373] font-semibold py-2 px-4 rounded-lg transition-transform transform hover:bg-[#3B1E54] hover:text-white hover:shadow-md duration-300"
              onClick={() => signOut()}
            >
              Sign Out
            </Button> */}
          </div>
        ) : (
          <div>
            {pathName.startsWith("/user/") ? (
              <Button
                className="bg-[#3B1E54] text-[#ecb365] rounded-lg px-4 py-2 transition duration-200 hover:bg-[#340e56] hover:text-white"
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Signup to receive messages
              </Button>
            ) : (
              <Button
                className="bg-[#3B1E54] text-[#ecb365] rounded-lg px-4 py-2 transition duration-200 hover:bg-[#340e56] hover:text-white"
                onClick={() => {
                  router.push("/signin");
                }}
              >
                <LogInIcon /> Signin
              </Button>
            )}
          </div>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
