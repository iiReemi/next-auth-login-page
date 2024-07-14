import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ResponsiveAppBar from "@/components/responsive-app-bar";
import { getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <ResponsiveAppBar />
    </div>
  );
}
