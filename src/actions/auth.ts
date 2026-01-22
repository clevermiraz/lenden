"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    phone: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    date_joined: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export const registerAction = async (formData: FormData) => {
  try {
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("first_name") as string | null;
    const lastName = formData.get("last_name") as string | null;

    const response = await axiosInstance.post<AuthResponse>("/api/auth/register/", {
      phone,
      password,
      first_name: firstName,
      last_name: lastName,
    });

    if (response.status === 201) {
      // Store tokens in cookies for server-side access
      const cookieStore = await cookies();
      cookieStore.set("access_token", response.data.tokens.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: "Registration failed",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Registration failed",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const loginAction = async (formData: FormData) => {
  try {
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const response = await axiosInstance.post<AuthResponse>("/api/auth/login/", {
      phone,
      password,
    });

    if (response.status === 200) {
      // Store tokens in cookies for server-side access
      const cookieStore = await cookies();
      cookieStore.set("access_token", response.data.tokens.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      cookieStore.set("refresh_token", response.data.tokens.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 90, // 90 days
      });

      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      error: "Login failed",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Login failed",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  redirect("/auth/login");
};

export const getCurrentUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    if (!token) {
      return null;
    }

    const response = await axiosInstance.get("/api/auth/profile/", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    return response.data;
  } catch (error) {
    return null;
  }
};
