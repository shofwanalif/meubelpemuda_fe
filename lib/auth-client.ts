import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.alfanialif.my.id",

  plugins: [
    adminClient(), // Aktifkan plugin admin di sisi client
  ],
});

export const { signIn, signUp, signOut, useSession, admin } = authClient;
