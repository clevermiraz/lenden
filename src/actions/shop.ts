"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface Shop {
  id: number;
  name: string;
  shopName?: string;
  shop_type: string;
  language: string;
  owner?: any;
  created_at: string;
  updated_at: string;
}

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
};

export const getShop = async (): Promise<Shop | null> => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await axiosInstance.get<Shop>("/api/shops/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createShopAction = async (formData: FormData) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const name = formData.get("shopName") as string;
    const shopType = (formData.get("shop_type") as string) || "other";
    const language = (formData.get("language") as string) || "bn";

    const response = await axiosInstance.post<{ shop: Shop; message: string }>(
      "/api/shops/create/",
      {
        shopName: name,
        shop_type: shopType,
        language,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      revalidatePath("/dashboard");
      revalidatePath("/setup");
      return {
        success: true,
        data: response.data.shop,
      };
    }

    return {
      success: false,
      error: "Failed to create shop",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Failed to create shop",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const updateShopAction = async (formData: FormData) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const data: Partial<Shop> = {};
    const name = formData.get("name") as string | null;
    const shopType = formData.get("shop_type") as string | null;
    const language = formData.get("language") as string | null;

    if (name) data.name = name;
    if (shopType) data.shop_type = shopType;
    if (language) data.language = language;

    const response = await axiosInstance.put<{ shop: Shop; message: string }>(
      "/api/shops/update/",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      revalidatePath("/dashboard");
      return {
        success: true,
        data: response.data.shop,
      };
    }

    return {
      success: false,
      error: "Failed to update shop",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Failed to update shop",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};
