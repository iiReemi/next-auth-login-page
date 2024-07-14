"use client";

import { Button } from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
