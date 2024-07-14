import PrivateRouteProvider from "@/providers/privateRouteProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PrivateRouteProvider>{children}</PrivateRouteProvider>
    </>
  );
}
