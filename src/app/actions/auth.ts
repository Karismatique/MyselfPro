"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Veuillez saisir une adresse email valide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

export async function registerUser(prevState: unknown, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const validationResult = registerSchema.safeParse({ name, email, password });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { name: validName, email: validEmail, password: validPassword } = validationResult.data;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.user.findUnique({
      where: { email: validEmail.toLowerCase() },
    });

    if (existingUser) {
      return { error: "Cet email est déjà utilisé par un autre compte." };
    }

    // Hachage du mot de passe avec bcryptjs (10 rounds)
    const hashedPassword = await bcrypt.hash(validPassword, 10);

    // Création de l'utilisateur en base
    await db.user.create({
      data: {
        name: validName,
        email: validEmail.toLowerCase(),
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return { error: "Une erreur est survenue lors de la création de votre compte." };
  }

  // Redirection automatique vers /login en cas de succès
  redirect("/login?registered=true");
}

export async function loginWithCredentials(prevState: unknown, formData: FormData) {
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
    throw error;
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
