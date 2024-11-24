import { z } from "zod";

export const schema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long.",
  }),
  email: z.string().email({
    message: "Email must be a valid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});
