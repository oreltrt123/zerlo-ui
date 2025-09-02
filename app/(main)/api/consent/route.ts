import { NextResponse } from "next/server";

export async function POST() {
  // Here you could store IP + consent in DB if desired
  return NextResponse.json({ message: "Consent recorded" }, { status: 200 });
}

export async function GET() {
  // Optionally handle GET requests if needed
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}