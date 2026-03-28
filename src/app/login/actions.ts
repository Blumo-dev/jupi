"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
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
