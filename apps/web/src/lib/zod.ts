import { object, string, z } from "zod";

export const signInSchema = object({
  username: string({ required_error: "Username is required" })
    .min(1, "Username is required")
    .max(16, "Username must be less than 16 characters"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const createUserSchema = object({
  username: string({ required_error: "Username is required" })
    .min(1, "Username is required")
    .max(16, "Username must be less than 16 characters"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  role: z.enum(["ADMIN", "USER"], { required_error: "Role is required" }),
});
