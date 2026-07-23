"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function loginWithCredentials(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Identifiants invalides. Veuillez réessayer." };
        default:
          return { error: "Une erreur d'authentification est survenue." };
      }
    }
    throw error; // Indispensable pour que la redirection interne de Next.js fonctionne
  }
}

export async function loginWithGithub() {
  try {
    await signIn("github", { redirectTo: "/dashboard" });
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    throw error;
  }
}
