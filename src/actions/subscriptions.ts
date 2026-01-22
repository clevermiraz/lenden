"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface Subscription {
  id: number;
  status: "trial" | "active" | "expired" | "cancelled";
  trial_start_date: string;
  trial_end_date: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  is_active: boolean;
  days_remaining: number;
}

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
};

export const getSubscription = async (): Promise<Subscription | null> => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await axiosInstance.get<Subscription>("/api/subscriptions/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    return null;
  }
};

export const activateSubscriptionAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const response = await axiosInstance.post<{ subscription: Subscription; message: string }>(
      "/api/subscriptions/activate/",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      revalidatePath("/subscription");
      return {
        success: true,
        data: response.data.subscription,
      };
    }

    return {
      success: false,
      error: "Failed to activate subscription",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Failed to activate subscription",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};
