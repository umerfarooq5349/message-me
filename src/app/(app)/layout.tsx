import { NavBar } from "@/components/navBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-5/6 container m-auto flex flex-col ">
      <NavBar />
      {children}
    </div>
  );
}
