import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error("Server action error:", e);

    if (e instanceof Error) {
      return e.message;
    }

    return "An unknown error occurred.";
  },
});
