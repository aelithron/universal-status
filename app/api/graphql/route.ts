import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { getUserDoc } from '@/utils/db';

const resolvers = {
  Query: {
    info: (email: string | undefined) => getStatus(email)
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
  if (!email && session && session.user && session.user.email) {
    email = session.user.email;
  } else {
    return;
  }
  const userStatus = await getUserDoc(email);
  if (!userStatus) return `{ error: "invalid_user", message: "The provided user doesn't exist." }`;
  return userStatus.status
}