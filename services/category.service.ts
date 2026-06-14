import { api } from "@/lib/axios";

// --- Base Category (dari response data) ---
export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  branch: {
    id: string;
    name: string;
  };
}

// --- Parameter untuk getAll ---
export interface CategoryParams {
  page: number;
  limit: number;
  branchId?: string;
}

// --- Response wrapper untuk list ---
export interface APICategoryResponse {
  message: string;
  data: Category[];
  meta: {
    current_page: number;
    last_page: number;
    page_size: number;
    total: number;
  };
}

// --- Payload create ---
export interface CreateCategoryPayload {
  name: string;
  branchId?: string;
}

// --- Payload update ---
export interface UpdateCategoryPayload {
  name: string;
}

export interface CategoryMutationResponse {
  message: string;
  data?: Category;
}

export const categoryService = {
  // GET /api/categories?page=1&limit=10&branchId=xxx
  getAll: async (params: CategoryParams): Promise<APICategoryResponse> => {
    const response = await api.get("/api/categories", {
      params,
    });
    return response.data;
  },

  // POST /api/categories/create
  create: async (
    payload: CreateCategoryPayload,
  ): Promise<CategoryMutationResponse> => {
    const response = await api.post("/api/categories/create", payload);
    return response.data;
  },

  // PUT /api/categories/update/:id
  update: async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<CategoryMutationResponse> => {
    const response = await api.put(`/api/categories/update/${id}`, payload);
    return response.data;
  },

  // DELETE /api/categories/delete/:id
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/categories/delete/${id}`);
    return response.data;
  },
};
