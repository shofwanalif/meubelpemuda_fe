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
  pageSize: number;
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

export interface Sale {
  id: string;
  saleDate: string;
  notes: string;
  createdAt: string;
  branch: SaleBranch;
  createdBy: SaleUser;
  totalSell: number;
  grossProfit: number;
  itemCount: number;
}

export interface SaleItem {
  id: string;
  qty: number;
  sellPriceSnapshot: number;
  costPriceSnapshot: number;
  totalSell: number | null;
  grossProfit: number;
  product: {
    id: string;
    name: string;
    unit: string;
  };
}

export interface SaleDetail extends Sale {
  items: SaleItem[];
}

export interface CreateSaleItemPayload {
  productId: string;
  qty: number;
}

export interface BaseCreateSalePayload {
  items: CreateSaleItemPayload[];
  notes?: string;
}

export interface CreateOwnerSalePayload extends BaseCreateSalePayload {
  branchId: string;
}

export type CreateKaryawanSalePayload = BaseCreateSalePayload;

export type CreateSalePayload =
  | CreateOwnerSalePayload
  | CreateKaryawanSalePayload;

// 2. Interface untuk Data Statistik Penjualan
export interface SalesSummaryData {
  totalSales: number;
  totalItems: string;
  totalRevenue: string;
  totalCost: string;
  totalGrossProfit: string;
}

export interface APISalesSummaryResponse {
  message: string;
  data: SalesSummaryData;
}

export interface APISaleResponse {
  message: string;
  meta: PaginationMeta;
  data: Sale[];
}

export interface APISaleDetailResponse {
  message: string;
  data: SaleDetail;
}

// 3. Service Object
export const salesService = {
  getSummary: async (
    params: SalesSummaryParams,
  ): Promise<APISalesSummaryResponse> => {
    const response = await api.get("/api/sales/summary", {
      params, // Axios otomatis merubah object ini menjadi query string (?branchId=...&startDate=...)
    });
    return response.data;
  },

  getAll: async (params: SaleParams): Promise<APISaleResponse> => {
    const response = await api.get("/api/sales", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<APISaleDetailResponse> => {
    const response = await api.get(`/api/sales/${id}`);
    return response.data;
  },

  create: async (payload: CreateSalePayload) => {
    const response = await api.post("/api/sales/create", payload);
    return response.data;
  },
};
