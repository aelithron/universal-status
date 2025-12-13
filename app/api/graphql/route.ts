import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { getUserDoc } from '@/utils/db';
import { GraphQLError } from 'graphql/error';
import { Platform, Status } from '@/universalstatus';
import getSelectablePlatforms from '@/utils/selectablePlatforms';
import { changeStatus } from '@/utils/changeStatus';
import { Emoji } from 'emoji-type';

const resolvers = {
  Query: {
    info: (_: unknown, args: { email: string | undefined }) => getStatus(args.email)
  },
  Mutation: {
    setStatus: (_: unknown, args: { status: string, emoji: string, expiry: string | null | undefined, platforms: Platform[] }) => setStatus(args.status, args.emoji, args.expiry, args.platforms)
  }
};

const typeDefs = gql`
  type Status {
    status: String!
    emoji: String!
    expiry: String
    setAt: String!
  }
  type PlatformError {
    platform: String!
    message: String!
  }
  type SetStatusResult {
    status: Status!
    platformErrors: [String!]!
  }
  type Query {
    info(email: String): Status
  }
  type Mutation {
    setStatus(status: String!, emoji: String!, expiry: String, platforms: [String]): SetStatusResult
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
  return userStatus.status;
}

async function setStatus(status: string, emoji: string, expiry: string | null | undefined, platforms: Platform[]): Promise<{ status: Status, platformErrors: string[] }> {
  const session = await auth();
  if (!session || !session.user) throw new GraphQLError("Not logged in, please log in to continue.", { extensions: { code: "UNAUTHORIZED" } });
  if (!session.user.email) throw new GraphQLError("You don't have an email in your profile, try logging back in.", { extensions: { code: "INVALID_PROFILE" } });
  if (expiry && (isNaN(new Date(expiry).valueOf()) || new Date(expiry) < new Date())) throw new GraphQLError("An 'expiry' parameter was in the request, but it was not valid!", { extensions: { code: "INVALID_EXPIRY" } })
  if (!platforms) platforms = getSelectablePlatforms();
  const userDoc = await getUserDoc(session.user.email);
  if (!userDoc) throw new GraphQLError("The provided user doesn't exist, try logging back in.", { extensions: { code: "INVALID_USER" } });
  const platformErrorsRaw = await changeStatus(userDoc, platforms, status.trim(), emoji.trim() as Emoji, expiry ? new Date(expiry.trim()) : null);
  const platformErrors: string[] = [];
  for (const error of platformErrorsRaw) platformErrors.push(`${error.platform}: ${error.message}`);
  return { status: userDoc.status, platformErrors: platformErrors };
}