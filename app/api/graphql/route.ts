import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { getUserDoc } from '@/utils/db';
import { GraphQLError } from 'graphql/error';
import { Platform } from '@/universalstatus';
import getSelectablePlatforms from '@/utils/selectablePlatforms';
import { changeStatus } from '@/utils/changeStatus';
import { Emoji } from 'emoji-type';

const resolvers = {
  Query: {
    info: (_: unknown, args: { email: string | undefined }) => getStatus(args.email)
  },
  Mutation: {
    setStatus: (_: unknown, args: { status: string, emoji: string, platforms: Platform[] }) => setStatus(args.status, args.emoji, args.platforms)
  }
};

const typeDefs = gql`
  type Status {
    status: String
    emoji: String
    setAt: String
  }
  type Query {
    info(email: String): Status
  }
  type Mutation {
    setStatus(status: String!, emoji: String!, platforms: [String]): [String]
  }
`;

const server = new ApolloServer({ resolvers, typeDefs });
const handler = startServerAndCreateNextHandler<NextRequest>(server, { context: async req => ({ req }) });
export { handler as GET, handler as POST };

async function getStatus(email: string | undefined) {
  const session = await auth();
  if (!email && session?.user?.email) email = session.user.email;
  if (!email) throw new GraphQLError("The request didn't contain an email, and was made while signed out.", { extensions: { code: "MISSING_EMAIL" } });
  const userStatus = await getUserDoc(email);
  if (!userStatus) throw new GraphQLError("The provided user doesn't exist.", { extensions: { code: "INVALID_USER" } });
  return { status: userStatus.status.status, emoji: userStatus.status.emoji, setAt: new Date(userStatus.status.setAt).toString() };
}

async function setStatus(status: string, emoji: string, platforms: Platform[]) {
  const session = await auth();
  if (!session || !session.user) throw new GraphQLError("Not logged in, please log in to continue.", { extensions: { code: "UNAUTHORIZED" } });
  if (!session.user.email) throw new GraphQLError("You don't have an email in your profile, try logging back in.", { extensions: { code: "INVALID_PROFILE" } });
  if (!platforms || platforms.length < 1) platforms = getSelectablePlatforms();
  const userDoc = await getUserDoc(session.user.email);
  if (!userDoc) throw new GraphQLError("The provided user doesn't exist, try logging back in.", { extensions: { code: "INVALID_USER" } });
  const platformErrors = await changeStatus(userDoc, platforms, status.trim(), emoji.trim() as Emoji);
  return { platform_errors: platformErrors };
}