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
  const slackTempCode = req.nextUrl.searchParams.get("code");
  if (!slackTempCode) return NextResponse.json({ error: "missing_code", message: "URL is missing a code parameter, please try again with Slack auth!" }, { status: 400 });

  const slackRes = await fetch("https://slack.com/api/oauth.v2.access", { 
    method: "POST", 
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: slackTempCode,
      client_id: process.env.SLACK_ID!,
      client_secret: process.env.SLACK_SECRET!,
      redirect_uri: `${process.env.AUTH_URL}/api/provider/slack`
    }).toString()
  });
  if (!slackRes) return NextResponse.json({ error: "get_token_failed", message: "Failed to get the Slack authorization token, make sure the code is correct!" }, { status: 500 });
  const slackBody = await slackRes.json();
  if (!slackBody.authed_user || !slackBody.authed_user.access_token) return NextResponse.json({ error: "get_token_failed", message: "Failed to get the Slack authorization token, make sure the code is correct!" }, { status: 500 });
  await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").updateOne({ user: session.user.email }, {
    $set: { slackToken: slackBody.authed_user.access_token }
  });
  return NextResponse.redirect(`${process.env.AUTH_URL}/settings`);
}

export async function DELETE() {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (session.user.email === null || session.user.email === undefined) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  const userDoc = await getUserDoc(session.user.email);
  if (!userDoc) return NextResponse.json({ error: "invalid_user", message: "The provided user doesn't exist, try logging back in." }, { status: 400 });
  await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").updateOne({ user: session.user.email }, {
    $set: { slackToken: null }
  });
  return NextResponse.json({ message: "Removed your Slack token successfully." });
}