"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface Notification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
};

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    const response = await axiosInstance.get<{ notifications: Notification[] }>("/api/auth/notifications/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.notifications || [];
  } catch (error) {
    return [];
  }
};

export const markNotificationReadAction = async (notificationId: number) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const response = await axiosInstance.put(
      `/api/auth/notifications/${notificationId}/read/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      revalidatePath("/notifications");
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: "Failed to mark notification as read",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to mark notification as read",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const markAllNotificationsReadAction = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const response = await axiosInstance.put(
      "/api/auth/notifications/read-all/",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      revalidatePath("/notifications");
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: "Failed to mark all notifications as read",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to mark all notifications as read",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};
