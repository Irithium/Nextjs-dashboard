import type { NextAuthConfig } from "next-auth";
import type { CredentialInput } from "next-auth/providers";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { User } from "./app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export default {
  providers: [
    Google,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" } as CredentialInput,
        password: { label: "Password", type: "password" } as CredentialInput,
        name: {
          label: "Name",
          type: "text",
          optional: true,
        } as CredentialInput,
        type: { label: "Type", type: "text" } as CredentialInput,
      },
      async authorize(credentials: any) {
        if (!credentials?.type) {
          throw new Error("Missing required fields");
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const { email, password, name, type } = credentials;

        if (type === "login") {
          // Proceso de login
          const user = await sql`
            SELECT * FROM users WHERE email = ${email}
          `;

          if (user.length === 0) {
            throw new Error("No user found with this email");
          }
          const isValidPassword = await bcrypt.compare(
            password,
            user[0].password
          );
          if (!isValidPassword) {
            console.error("Invalid password");
            return "Invalid password";
            return null; // Devuelve null si la contraseña es incorrecta
          }

          return {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
          };
        } else if (type === "register") {
          // Proceso de registro
          const existingUser = await sql`
            SELECT * FROM users WHERE email = ${email}
          `;

          if (existingUser.length > 0) {
            throw new Error("This email is already in use");
          }

          if (!name) {
            throw new Error("Name is required for registration");
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${hashedPassword})
            RETURNING id, name, email
          `;

          return {
            id: newUser[0].id,
            name: newUser[0].name,
            email: newUser[0].email,
          };
        } else {
          throw new Error("Invalid request type");
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET!,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
