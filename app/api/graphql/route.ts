import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { getUserDoc } from '@/utils/db';
import { GraphQLError } from 'graphql/error';

const resolvers = {
  Query: {
    info: (_: unknown, args: { email: string | undefined }) => getStatus(args.email)
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
`;

const server = new ApolloServer({ resolvers, typeDefs });
const handler = startServerAndCreateNextHandler<NextRequest>(server, { context: async req => ({ req }) });
export { handler as GET, handler as POST };

async function getStatus(email: string | undefined) {
  const session = await auth();
  if (!email && session?.user?.email) email = session.user.email;
  if (!email) {
    throw new GraphQLError("The request didn't contain an email, and was made while signed out.", { extensions: { code: "MISSING_EMAIL" } });
  }
  const userStatus = await getUserDoc(email);
  if (!userStatus) throw new GraphQLError("The provided user doesn't exist.", { extensions: { code: "INVALID_USER" } });
  return { status: userStatus.status.status, emoji: userStatus.status.emoji, setAt: new Date(userStatus.status.setAt).toString() };
}