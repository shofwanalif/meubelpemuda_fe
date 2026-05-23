import { api } from "@/lib/axios";

// --- Metadata Pagination ---
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  page_size: number;
  total: number;
}

// --- Detail Cabang ---
export interface ProductBranch {
  id: string;
  name: string;
}

// --- REVISI: Struktur Harga untuk Owner (Array) ---
export interface ProductPriceOwner {
  id: string;
  costPrice: string;
  sellPrice: string;
  effectiveFrom: string;
  createdAt: string;
  productId: string;
  branchId: string | null;
  updatedById: string;
  branch: ProductBranch | null;
}

// --- Struktur Harga untuk Karyawan (Single Object) ---
export interface ProductPriceKaryawan {
  costPrice: string;
  sellPrice: string;
  source: string;
}

// --- Base Product ---
export interface ProductBase {
  id: string;
  name: string;
  description: string;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// --- Unified Product Type ---
export type Product = ProductBase & {
  prices?: ProductPriceOwner[]; // Muncul jika Owner
  price?: ProductPriceKaryawan; // Muncul jika Karyawan
};

// --- Params & Response ---
export interface ProductParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface APIProductResponse {
  message: string;
  meta: PaginationMeta;
  data: Product[];
}

// --- Interface untuk Harga di sisi Owner ---
export interface CreateProductPriceOwner {
  branchId?: string; // Jika tidak ada, maka dianggap harga global/pusat
  costPrice: number;
  sellPrice: number;
}

// --- Payload khusus Owner ---
export interface CreateProductPayloadOwner {
  name: string;
  description: string;
  unit: string;
  prices: CreateProductPriceOwner[];
}

// --- Payload khusus Karyawan ---
export interface CreateProductPayloadKaryawan {
  name: string;
  description: string;
  unit: string;
  costPrice: number;
  sellPrice: number;
}

// --- Gabungan Payload (Union) ---
export type CreateProductPayload =
  | CreateProductPayloadOwner
  | CreateProductPayloadKaryawan;

type UpdateInfo = Partial<Pick<ProductBase, "name" | "description" | "unit">>;

export interface UpdateProductPriceOwner {
  branchId: string | null; // null untuk harga global
  costPrice: number;
  sellPrice: number;
}

export interface UpdateProductPayloadOwner extends UpdateInfo {
  prices?: UpdateProductPriceOwner[];
}

export interface UpdateProductPayloadKaryawan extends UpdateInfo {
  costPrice?: number;
  sellPrice?: number;
}

export type UpdateProductPayload =
  | UpdateProductPayloadOwner
  | UpdateProductPayloadKaryawan;

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
    return api.put(`/api/products/update/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete(`/api/products/delete/${id}`);
  },

  deactivate: (id: string) => {
    return api.patch(`/api/products/deactivate/${id}`);
  },

  activate: (id: string) => {
    return api.patch(`/api/products/activate/${id}`);
  },
};
