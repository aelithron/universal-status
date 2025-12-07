import { auth } from "@/auth";
import { UserDoc } from "@/universalstatus";
import client, { getUserDoc } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (session.user.email === null || session.user.email === undefined) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  const userDoc = await getUserDoc(session.user.email);
  if (!userDoc) return NextResponse.json({ error: "invalid_user", message: "The provided user doesn't exist, try logging back in." }, { status: 400 });
  const githubTempCode = req.nextUrl.searchParams.get("code");
  if (!githubTempCode) return NextResponse.json({ error: "missing_code", message: "URL is missing a code parameter, please try again with GitHub auth!" }, { status: 400 });

  const githubRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: githubTempCode,
      client_id: process.env.GITHUB_ID!,
      client_secret: process.env.GITHUB_SECRET!,
    }).toString()
  });
  if (!githubRes) return NextResponse.json({ error: "get_token_failed", message: "Failed to get the GitHub authorization token, make sure the code is correct!" }, { status: 500 });
  const accessToken = parseGitHubReturn(await githubRes.text()).access_token;
  if (!accessToken) return NextResponse.json({ error: "get_token_failed", message: "Failed to get the GitHub authorization token, make sure the code is correct!" }, { status: 500 });
  await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").updateOne({ user: session.user.email }, {
    $set: { githubToken: accessToken }
  });
  return NextResponse.redirect(`${process.env.AUTH_URL}/settings`);
}
function parseGitHubReturn(queryString: string) {
  const query: Record<string, string> = {};
  const pairs = (queryString[0] === '?' ? queryString.slice(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

export async function DELETE() {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (session.user.email === null || session.user.email === undefined) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  const userDoc = await getUserDoc(session.user.email);
  if (!userDoc) return NextResponse.json({ error: "invalid_user", message: "The provided user doesn't exist, try logging back in." }, { status: 400 });
  await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").updateOne({ user: session.user.email }, {
    $set: { githubToken: null }
  });
  return NextResponse.json({ message: "Removed your GitHub token successfully." });
}