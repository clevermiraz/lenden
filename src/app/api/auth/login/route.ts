import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/lib/axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axiosInstance.post("/api/auth/login/", body);

    // Set cookies for server-side access
    const nextResponse = NextResponse.json(response.data);
    nextResponse.cookies.set("access_token", response.data.tokens.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    nextResponse.cookies.set("refresh_token", response.data.tokens.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 90, // 90 days
    });

    return nextResponse;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || error.response?.data?.error || "Login failed" },
      { status: error.response?.status || 500 }
    );
  }
}
