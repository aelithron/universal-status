import { Emoji } from "emoji-type";
import { getUserDoc } from "./db";
import { ApolloClient, gql } from "@apollo/client";
import { InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { ApolloLink } from "@apollo/client";

export async function updateSlack(user: string, status: string, emoji: Emoji): Promise<{ message: string, error: boolean }> {
  const userDoc = await getUserDoc(user);
  if (!userDoc) return { message: "The provided user doesn't exist!", error: true };
  try {
    const result = await fetch(`https://www.slack.com/api/users.profile.set`, {
      method: "POST", headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userDoc.slackToken}`
      }, body: JSON.stringify({
        profile: {
          status_text: status,
          status_emoji: emoji,
          status_expiration: 0
        }
      })
    });
    const jsonResult = await result.json();
    if (result.ok && jsonResult.ok) {
      return { message: "Status updated successfully!", error: false };
    } else {
      return { message: `Error from the Slack API: ${jsonResult.error}`, error: true };
    }
  } catch (e) {
    console.warn(`Unknown error in pushing status to Slack for user "${user}"!\n${e}`);
    return { message: `Unknown error, contact the site administrator and tell them to check the console!`, error: true };
  }
}

export async function updateGithub(user: string, status: string, emoji: Emoji): Promise<{ message: string, error: boolean }> {
  const userDoc = await getUserDoc(user);
  if (!userDoc) return { message: "The provided user doesn't exist!", error: true };
  const ghClientAuth = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: `Bearer ${userDoc.githubToken}`,
      },
    }));
    return forward(operation);
  });
  const gqlClient = new ApolloClient({
    link: ApolloLink.from([ghClientAuth, new HttpLink({ uri: "https://api.github.com/graphql" })]),
    cache: new InMemoryCache()
  });
  try {
    const statusRes = await gqlClient.mutate({
      mutation: gql`
      mutation {
        changeUserStatus(input: { clientMutationId: "universal-status-${process.hrtime.bigint()}", emoji: "${emoji}", message: "${status}" }) {
          clientMutationId
        }
      }
    `,
    });
    if (!statusRes.error) {
      return { message: "Status updated successfully!", error: false };
    } else {
      return { message: `Error from the GitHub API: ${statusRes.error.name + ` - ` + statusRes.error.message}`, error: true };
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (ignored) {
    return { message: `Error from the GitHub API: Unknown`, error: true };
  }
}

export async function updateStatusCafe(user: string, status: string, emoji: Emoji): Promise<{ message: string, error: boolean }> {
  const userDoc = await getUserDoc(user);
  if (!userDoc) return { message: "The provided user doesn't exist!", error: true };

  try {
    const formData = new FormData();
    formData.append("gorilla.csrf.Token", userDoc.statusCafeToken!); // run this javascript on the homepage to find it: document.querySelector("form > input[type=hidden]").value
    formData.append("face", emoji);
    formData.append("content", status);
    fetch("https://status.cafe/add?silent=1", {
      method: "POST",
      body: formData,
      headers: {
        "Cookie": userDoc.statusCafeCookie
      }
    });
    return { message: "Status updated successfully!", error: false };
  } catch (e) {
    console.warn(`Unknown error in pushing status to Status.Café for user "${user}"!\n${e}`);
    return { message: `Unknown error, contact the site administrator and tell them to check the console!`, error: true };
  }
}