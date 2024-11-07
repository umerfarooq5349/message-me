import { NavBar } from "@/components/navBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen  relative overflow-hidden">
      <div className="fixed top-0 w-full flex justify-center z-50">
        <div className="w-5/6">
          <NavBar />
        </div>
      </div>

      <div className="w-5/6 min-h-screen container m-auto flex flex-col justify-evenly pt-20 z-40">
        {children}
        <footer className="mt-8 text-center text-[#D4A373] font-light text-sm md:text-base">
          © 2024 - All rights reserved
        </footer>
      </div>
    </div>
  );
}
