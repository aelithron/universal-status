import { auth } from "@/auth";
import { Platform } from "@/universalstatus";
import { changeStatus } from "@/utils/changeStatus";
import { getUserDoc } from "@/utils/db";
import getSelectablePlatforms from "@/utils/selectablePlatforms";
import { Emoji } from "emoji-type";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  let email: string = "";
  const emailParam = req.nextUrl.searchParams.get("email");
  if (emailParam && emailParam.length >= 1) {
    email = emailParam;
  } else {
    if (session && session.user && session.user.email) {
      email = session.user.email;
    } else {
      return NextResponse.json({ error: "missing_email", message: "The URL had no '?email' parameter, and was requested without an active session." }, { status: 400 });
    }
  }
  const userStatus = await getUserDoc(email);
  if (!userStatus) return NextResponse.json({ error: "invalid_user", message: "The provided user doesn't exist." }, { status: 400 });
  return NextResponse.json(userStatus.status);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (!session.user.email) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  const body = await req.json();
  if (!body) return NextResponse.json({ error: "invalid_body", message: "The request has an invalid or missing body!" }, { status: 400 });
  if (!body.status || (body.status as string).trim().length < 1) return NextResponse.json({ error: "missing_status", message: "The request was missing a 'status' parameter!" }, { status: 400 });
  if (!body.emoji || (body.emoji as string).trim().length < 1) return NextResponse.json({ error: "missing_emoji", message: "The request was missing an 'emoji' parameter!" }, { status: 400 });
  if (body.expiry && (isNaN(new Date(body.expiry).valueOf()) || new Date(body.expiry) < new Date())) return NextResponse.json({ error: "invalid_expiry", message: "An 'expiry' parameter was in the request, but it was not valid!" }, { status: 400 });
  let platforms: Platform[] = [];
  if (body.platforms) {
    platforms = body.platforms;
  } else {
    platforms = getSelectablePlatforms();
  }
  const userDoc = await getUserDoc(session.user.email);
  if (!userDoc) return NextResponse.json({ error: "invalid_user", message: "The provided user doesn't exist, try logging back in." }, { status: 400 });
  const platformErrors = await changeStatus(userDoc, platforms, (body.status as string).trim(), (body.emoji as string).trim() as Emoji, body.expiry ? new Date((body.expiry as string).trim()) : null);
  return NextResponse.json({ message: "Set status successfully!", platformErrors });
}