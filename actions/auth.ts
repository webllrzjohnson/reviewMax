"use server";

import { AuthError } from "next-auth";
import { signIn as authSignIn, signOut as authSignOut } from "@/auth";

export type SignInState = {
  error?: string;
};

function safeInternalPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }
  return next;
}

/**
 * Email/password sign-in for admin users via Auth.js credentials provider.
 */
export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const nextRaw = formData.get("next");
  const next = safeInternalPath(
    typeof nextRaw === "string" ? nextRaw : null,
  );

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Email and password are required." };
  }
  if (!email.trim() || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    await authSignIn("credentials", {
      email: email.trim(),
      password,
      redirectTo: next,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Could not sign in. Try again." };
      }
    }
    throw error;
  }

  return {};
}

/** Signs out the current admin session. */
export async function signOut(): Promise<void> {
  await authSignOut({ redirectTo: "/" });
}
