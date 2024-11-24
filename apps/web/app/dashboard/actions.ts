"use server";

import { auth, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const { session } = await auth();

  if (!session) {
    return {
      message: "Not authenticated",
    };
  }

  await logout();

  redirect("/login");
}
