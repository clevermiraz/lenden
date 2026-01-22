"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface CreditEntry {
  id: number;
  customer: any;
  customerId?: number;
  amount: string;
  date: string;
  description?: string;
  status: "pending" | "confirmed" | "rejected";
  rejected_reason?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface PaymentEntry {
  id: number;
  customer: any;
  customerId?: number;
  amount: string;
  date: string;
  method: "cash" | "bkash" | "nagad";
  status: "pending" | "confirmed" | "rejected";
  rejected_reason?: string;
  createdAt: string;
  confirmedAt?: string;
}

const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
};

export const createCreditEntryAction = async (formData: FormData) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const customerId = parseInt(formData.get("customerId") as string);
    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string | null;
    const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];

    const response = await axiosInstance.post<{ credit_entry: CreditEntry; message: string }>(
      "/api/transactions/credits/create/",
      {
        customerId,
        amount: amount.toString(),
        description: description || undefined,
        date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      revalidatePath("/dashboard");
      revalidatePath("/ledger");
      revalidatePath(`/customers/${customerId}`);
      return {
        success: true,
        data: response.data.credit_entry,
      };
    }

    return {
      success: false,
      error: "Failed to create credit entry",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Failed to create credit entry",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const createPaymentEntryAction = async (formData: FormData) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const customerId = parseInt(formData.get("customerId") as string);
    const amount = parseFloat(formData.get("amount") as string);
    const method = (formData.get("method") as "cash" | "bkash" | "nagad") || "cash";
    const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];

    const response = await axiosInstance.post<{ payment_entry: PaymentEntry; message: string }>(
      "/api/transactions/payments/create/",
      {
        customerId,
        amount: amount.toString(),
        method,
        date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      revalidatePath("/dashboard");
      revalidatePath("/ledger");
      revalidatePath(`/customers/${customerId}`);
      return {
        success: true,
        data: response.data.payment_entry,
      };
    }

    return {
      success: false,
      error: "Failed to create payment entry",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Failed to create payment entry",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const confirmCreditEntryAction = async (creditId: number, action: "confirm" | "reject", rejectedReason?: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const response = await axiosInstance.post<{ credit_entry: CreditEntry; message: string }>(
      `/api/transactions/credits/${creditId}/confirm/`,
      {
        action,
        rejected_reason: rejectedReason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      revalidatePath("/dashboard");
      revalidatePath("/ledger");
      revalidatePath("/customer");
      return {
        success: true,
        data: response.data.credit_entry,
      };
    }

    return {
      success: false,
      error: "Failed to confirm credit entry",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Failed to confirm credit entry",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const confirmPaymentEntryAction = async (paymentId: number, action: "confirm" | "reject", rejectedReason?: string) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const response = await axiosInstance.post<{ payment_entry: PaymentEntry; message: string }>(
      `/api/transactions/payments/${paymentId}/confirm/`,
      {
        action,
        rejected_reason: rejectedReason,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      revalidatePath("/dashboard");
      revalidatePath("/ledger");
      revalidatePath("/customer");
      return {
        success: true,
        data: response.data.payment_entry,
      };
    }

    return {
      success: false,
      error: "Failed to confirm payment entry",
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || "Failed to confirm payment entry",
      };
    }
    return {
      success: false,
      error: "An error occurred",
    };
  }
};

export const getCustomerLedger = async (customerId: number) => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await axiosInstance.get(`/api/transactions/ledger/customer/${customerId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return null;
  }
};

export const getShopLedger = async () => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await axiosInstance.get("/api/transactions/ledger/shop/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return null;
  }
};

export const getMyLedger = async () => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await axiosInstance.get("/api/transactions/ledger/my/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return null;
  }
};

export const getPendingEntries = async () => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await axiosInstance.get("/api/transactions/ledger/pending/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return null;
  }
};
