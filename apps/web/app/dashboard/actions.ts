"use server";

import { auth, logout } from "@/lib/auth";

export async function logoutAction() {
  const { session } = await auth();

  if (!session) {
    return {
      message: "Not authenticated",
    };
  }

  await logout();

  return {
    message: "Logged out successfully",
  };
}
