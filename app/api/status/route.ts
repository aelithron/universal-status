import { PlatformError } from "@/universalstatus";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: "Example text", setAt: new Date() }); // example code to build the ui around, add this once there's a db :3
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body) return NextResponse.json({ error: "invalid_body", message: "The request has an invalid or missing body!" });
  if (!body.status || (body.status as string).trim().length < 1) return NextResponse.json({ error: "missing_status", message: "The request was missing a 'status' parameter!" });
  // TODO: push to database with setAt: new Date() and status: (body.status as string).trim()

  const platformErrors: PlatformError[] = []; // this is for errors from other platforms, when pushing statuses

  return NextResponse.json({ message: "Set status successfully!", platformErrors });
}