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
  if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
    providers.push(Discord({
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
  if (process.env.AUTH_SLACK_ID && process.env.AUTH_SLACK_SECRET) {
    providers.push(Slack({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
        }
      }
    }));
  }
  if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
    providers.push(GitHub({
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