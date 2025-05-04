import type { NextAuthConfig, Session } from "next-auth";
import type { CredentialInput } from "next-auth/providers";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { User } from "./app/lib/definitions";
import { JWT } from "next-auth/jwt";

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

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined");
}

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET is not defined");
}

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" } as CredentialInput,
        password: { label: "Password", type: "password" } as CredentialInput,
        name: {
          label: "Name",
          type: "text",
        } as CredentialInput,
        type: { label: "Type", type: "text" } as CredentialInput,
      },
      async authorize(credentials) {
        if (!credentials?.type) {
          throw new Error("Missing required fields");
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const { email, password, name, type } = credentials;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          (name && typeof name !== "string") ||
          typeof type !== "string"
        ) {
          throw new Error("Invalid credentials format");
        }

        if (type === "login") {
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
            throw new Error("Invalid password");
          }

          return {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
          };
        } else if (type === "register") {
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

          const [newUser] = await sql<
            [{ id: string; name: string; email: string }]
          >`
  INSERT INTO users (name, email, password)
  VALUES (
    ${name as string}, 
    ${email as string}, 
    ${hashedPassword as string}
  )
  RETURNING id, name, email
`;
          console.log("New user created:", newUser);
          console.log("User ID:", newUser.id);
          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          };
        } else {
          throw new Error("Invalid request type");
        }
      },
    }),
  ],

  secret: process.env.AUTH_SECRET!,
  cookies: {
    sessionToken: {
      name: "__Secure-authjs.session-token",
      options: {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      },
    },
  },
  debug: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
