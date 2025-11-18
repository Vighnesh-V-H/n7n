import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import * as schema from "@/db/schema";
import { SESSION_EXPIRY_TIME, SESSION_UPDATE_AGE } from "./constants";
import { db } from "@/db";
import { bearer } from "better-auth/plugins";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),

  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  advanced: {
    ipAddress: { disableIpTracking: false },
  },
  session: {
    cookieName: "session",
    disableSessionRefresh: false,
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60,
    },

    expiresIn: SESSION_EXPIRY_TIME,
    updateAge: SESSION_UPDATE_AGE,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "57b53c5a-22f9-4015-9624-e40f7ecda5b3",
              slug: "N7N-Pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
