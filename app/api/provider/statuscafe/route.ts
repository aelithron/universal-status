import { auth } from "@/auth";
import { UserDoc } from "@/universalstatus";
import client, { getUserDoc } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (session.user.email === null || session.user.email === undefined) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  const userDoc = await getUserDoc(session.user.email);
  if (!userDoc) return NextResponse.json({ error: "invalid_user", message: "The provided user doesn't exist, try logging back in." }, { status: 400 });
  const body = await req.json();
  if (!body) return NextResponse.json({ error: "invalid_body", message: "The request has an invalid or missing body!" }, { status: 400 });
  if (!body.username || (body.username as string).trim().length < 1) return NextResponse.json({ error: "missing_username", message: "The request was missing a 'username' parameter!" }, { status: 400 });
  if (!body.password || (body.password as string).trim().length < 1) return NextResponse.json({ error: "missing_password", message: "The request was missing a 'password' parameter!" }, { status: 400 });

  const csrfRes = await fetch("https://status.cafe/login");
  const csrfToken = (new JSDOM(await csrfRes.text()).window.document.getElementsByName("gorilla.csrf.Token")[0])!.getAttribute("value")!;
  const csrfCookie = csrfRes.headers.getSetCookie()?.find(c => c.startsWith("_gorilla_csrf="))!.split(";")[0];
  const loginRes = await fetch("https://status.cafe/check-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": csrfCookie!
    },
    body: new URLSearchParams({
      name: body.username,
      password: body.password,
      "gorilla.csrf.Token": csrfToken
    }).toString()
  });
  const userCookie = loginRes.headers.getSetCookie()?.find(c => c.startsWith("status"))!.split(";")[0];
  if (!userCookie) return NextResponse.json({ success: false }, { status: 401 })
  await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").updateOne({ user: session.user.email }, {
    $set: { statusCafeCookie: userCookie, statusCafeCSRF: csrfCookie }
  });
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "unauthorized", message: "Not logged in, please log in to continue." }, { status: 401 });
  if (session.user.email === null || session.user.email === undefined) return NextResponse.json({ error: "invalid_profile", message: "You don't have an email in your profile, try logging back in." }, { status: 400 });
  const userDoc = await getUserDoc(session.user.email);
  if (!userDoc) return NextResponse.json({ error: "invalid_user", message: "The provided user doesn't exist, try logging back in." }, { status: 400 });
  await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").updateOne({ user: session.user.email }, {
    $set: { statusCafeCookie: null, statusCafeCSRF: null }
  });
  return NextResponse.json({ message: "Removed your Status.Café token successfully." });
}