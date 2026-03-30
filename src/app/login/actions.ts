"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    // A sikeres bejelentkezés után a Next.js redirect() egy speciális hibát dob — ezt át kell engedni!
    if (isRedirectError(error)) {
      throw error
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Helytelen email vagy jelszó!" }
        default:
          return { error: "Váratlan hiba történt a bejelentkezés során." }
      }
    }
    throw error
  }
}
