import PublicRouteProvider from "@/providers/publicRouteProvider";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PublicRouteProvider>{children}</PublicRouteProvider>
    </>
  );
}
