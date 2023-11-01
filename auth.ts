import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { User } from "./app/lib/definitions";
import bycrypt from "bcrypt";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users where email=${email}`;

    return user.rows[0];
  } catch (error) {
    console.error("Faield to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parseCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parseCredentials.success) {
          const { email, password } = parseCredentials.data;

          const user = await getUser(email);
          if (!user) return null;

          const passwordMatch = await bycrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }

        console.log("Invalid credentials.");
        return null;
      },
    }),
  ],
});
