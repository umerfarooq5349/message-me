import { NavBar } from "@/components/navBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B1E54] to-[#387478] text-[#3B1E54] relative overflow-hidden">
      <div className="fixed top-0 w-full flex justify-center z-50">
        <div className="w-5/6">
          <NavBar />
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-[#c6d6d7] h-16 w-10 bottom-20 right-16 rounded-full opacity-70 animate-bounce " />
        <div className="absolute bg-[#3db8c1] h-8 w-8 top-16 right-12 rounded-full opacity-80 animate-pulse " />
        <div className="absolute bg-[#D4BEE4] h-16 w-16 top-0 left-0 rounded-full opacity-60 animate-pulse " />
      </div>

      {/* Main content with padding-top to avoid overlap with fixed navbar */}
      <div className="w-5/6 container m-auto flex flex-col justify-between pt-20">
        {children}
      </div>
    </div>
  );
}
