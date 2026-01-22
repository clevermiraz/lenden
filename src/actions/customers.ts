"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface Customer {
  id: number;
  phone: string;
  name?: string;
  balance: number;
  shop?: any;
  created_at: string;
  updated_at: string;
}

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
};

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    const response = await axiosInstance.get<{ customers: Customer[] }>("/api/customers/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.customers || [];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    return [];
  }
};

export const getCustomer = async (customerId: number): Promise<Customer | null> => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await axiosInstance.get<Customer>(`/api/customers/${customerId}/`, {
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

export const createCustomerAction = async (formData: FormData) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const phone = formData.get("phone") as string;
    const name = formData.get("name") as string | null;

    const response = await axiosInstance.post<{ customer: Customer; message: string }>(
      "/api/customers/create/",
      {
        phone,
        name: name || undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201 || response.status === 200) {
      revalidatePath("/customers");
      revalidatePath("/dashboard");
      return {
        success: true,
        data: response.data.customer,
      };
    }

    return {
      success: false,
      error: "Failed to create customer",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Failed to create customer",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const updateCustomerAction = async (customerId: number, formData: FormData) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const data: Partial<Customer> = {};
    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null;

    if (name) data.name = name;
    if (phone) data.phone = phone;

    const response = await axiosInstance.put<{ customer: Customer; message: string }>(
      `/api/customers/${customerId}/update/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      revalidatePath("/customers");
      revalidatePath(`/customers/${customerId}`);
      revalidatePath("/dashboard");
      return {
        success: true,
        data: response.data.customer,
      };
    }

    return {
      success: false,
      error: "Failed to update customer",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Failed to update customer",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};
