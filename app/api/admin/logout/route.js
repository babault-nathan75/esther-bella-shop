import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(true);
  response.cookies.delete("admin_session");
  return response;
}
