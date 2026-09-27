import { NextResponse } from "next/server";
// Bundled at build time so it works on serverless hosts (no runtime fs read).
import sample from "@/fixtures/sample-care-plan.json";

export async function GET() {
  return NextResponse.json(sample);
}
