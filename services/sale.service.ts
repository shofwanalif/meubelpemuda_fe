import { api } from "@/lib/axios";
import { PaginationMeta } from "./product.service"; // Reuse type pagination dari service produk

// 1. Interface untuk Filter Parameters
export interface SalesSummaryParams {
  branchId?: string;
  startDate?: string;
  endDate?: string;
}

export interface SaleParams {
  page: number;
  limit: number;
  search?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
}

export interface SaleBranch {
  id: string;
  name: string;
}

export interface SaleUser {
  id: string;
  name: string;
}

export interface SaleCustomer {
  name: string;
}

export interface SaleCustomerDetail {
  name: string;
  address: string;
  phone: string;
}

// Sale untuk list (ringkas)
export interface Sale {
  id: string;
  saleDate: string;
  status: string;
  notes?: string | null;
  customer: SaleCustomer;
  createdAt: string;
  branch: SaleBranch;
  createdBy: SaleUser;
  totalSell: string;
}

// Item untuk detail sale
export interface SaleItem {
  id: string;
  qty: number;
  sellPriceSnapshot: string;
  discountAmount: string;
  costPriceSnapshot: string;
  totalSell: string | null;
  grossProfit: string;
  product: {
    id: string;
    name: string;
  };
}

// Detail sale (tidak extend Sale agar lebih eksplisit)
export interface SaleDetail {
  id: string;
  saleDate: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  customer: SaleCustomerDetail;
  branch: SaleBranch;
  createdBy: SaleUser;
  totalSell: string;
  totalGrossProfit: string;
  items: SaleItem[];
}

// --- Item dalam create sale (bisa punya discountAmount opsional) ---
export interface CreateSaleItemPayload {
  productId: string;
  qty: number;
  discountAmount?: number; // opsional, default 0
}

// --- Base create sale
export interface BaseCreateSalePayload {
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  notes?: string;
  items: CreateSaleItemPayload[];
}

export interface CreateOwnerSalePayload extends BaseCreateSalePayload {
  branchId: string;
}

// --- Karyawan: tidak perlu branchId
export type CreateKaryawanSalePayload = BaseCreateSalePayload;

export type CreateSalePayload =
  | CreateOwnerSalePayload
  | CreateKaryawanSalePayload;

// 2. Interface untuk Data Statistik Penjualan
export interface SalesSummaryData {
  period: {
    startDate: string;
    endDate: string;
  };
  totalTransaksi: number;
  totalTransaksiCancelled: string;
  totalRevenue: string;
  totalGrossProfit: string;
}

export interface SalesSummaryMonthlyData {
  period: string;
  totalRevenue: string;
  totalGrossProfit: string;
}

export interface APISaleResponse {
  message: string;
  meta: PaginationMeta;
  data: Sale[];
}

// 3. Service Object
export const salesService = {
  getSummary: async (params: SalesSummaryParams): Promise<SalesSummaryData> => {
    const response = await api.get("/api/sales/summary", {
      params,
    });
    return response.data;
  },

  getMonthlySummary: async (): Promise<SalesSummaryMonthlyData[]> => {
    const response = await api.get("/api/sales/summary/monthly");
    return response.data;
  },

  getAll: async (params: SaleParams): Promise<APISaleResponse> => {
    const response = await api.get("/api/sales", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<SaleDetail> => {
    const response = await api.get(`/api/sales/${id}`);
    return response.data;
  },

  create: async (payload: CreateSalePayload) => {
    const response = await api.post("/api/sales/create", payload);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.patch(`/api/sales/cancel/${id}`);
    return response.data;
  },
};
