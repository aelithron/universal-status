import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord";
import Slack from "next-auth/providers/slack";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "https://raw.githubusercontent.com/aelithron/universal-status/refs/heads/main/app/favicon.ico",
  },
  providers: providers(),
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
  },
});

function providers() {
  const providers = []
  if (process.env.DISCORD_ID && process.env.DISCORD_SECRET) {
    providers.push(Discord({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.global_name,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}?size=256`
        }
      }
    }));
  }
  if (process.env.SLACK_ID && process.env.SLACK_SECRET) {
    providers.push(Slack({
      clientId: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null
        }
      }
    }));
  }
  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        }
      }
    }));
  }
  return providers;
}