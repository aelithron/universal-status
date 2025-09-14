import { auth } from "@/auth";
import { UserDoc } from "@/universalstatus";
import client, { getUserDoc } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (session.user.email === null || session.user.email === undefined) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  const userDoc = await getUserDoc(session.user.email);
  if (!userDoc) return NextResponse.json({ error: "invalid_user", message: "The provided user doesn't exist, try logging back in." }, { status: 400 });
  
  /*
  await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").updateOne({ user: session.user.email }, {
    $set: { statusCafeToken, statusCafeCookie }
  });
  */
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