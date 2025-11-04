import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db"; // Adjust to your custom path // Adjust if using a custom output path
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";

import { admin } from "better-auth/plugins"




export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp}) {
        await resend.emails.send({
          from: "Aeliv <onboarding@resend.dev>",
          to: [email],
          subject: "Aeliv - verify your email",
          html: `<p>Hi,</p><p>Your verification code is: <strong>${otp}</strong></p>`,
        });
      },
    }),
    admin()
  ],
});
