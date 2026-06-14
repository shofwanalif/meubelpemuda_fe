import { api } from "@/lib/axios";

// --- Metadata Pagination ---
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  page_size: number;
  total: number;
}

export interface ProductBranch {
  id: string;
  name: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ActivePrice {
  id: string;
  costPrice: string; // string
  sellPrice: string; // string
  effectiveFrom: string; // ISO date
}

export interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branch: ProductBranch;
  category: ProductCategory;
  activePrice: ActivePrice;
}

export interface ProductParams {
  page: number;
  limit: number;
  search?: string;
  branchId?: string;
  categoryId?: string;
  lowStock?: number;
}

export interface APIProductResponse {
  message: string;
  meta: PaginationMeta;
  data: Product[];
}

export interface CreateProductPayloadOwner {
  branchId: string;
  name: string;
  description: string;
  categoryId: string;
  costPrice: number;
  sellPrice: number;
  stock?: number;
}

export interface CreateProductPayloadKaryawan {
  name: string;
  description: string;
  categoryId: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
}

export type CreateProductPayload =
  | CreateProductPayloadOwner
  | CreateProductPayloadKaryawan;

export interface UpdateProductPayload {
  branchId?: string;
  name?: string;
  description?: string;
  stock?: number;
  categoryId?: string;
  costPrice?: number;
  sellPrice?: number;
}

export const productService = {
  getAll: async (params: ProductParams): Promise<APIProductResponse> => {
    const response = await api.get("/api/products", {
      params,
    });
    return response.data;
  },

  create: (data: CreateProductPayload) => {
    return api.post("/api/products/create", data);
  },

  update: (id: string, data: UpdateProductPayload) => {
    return api.patch(`/api/products/update/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete(`/api/products/delete/${id}`);
  },
};
