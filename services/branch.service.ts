import { api } from "@/lib/axios";

export interface Branches {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  createdAt: string; // ISO 8601 format: "2026-05-09T04:26:48.121Z"
  updatedAt: string;
}

export interface APIBranchResponse {
  data: Branches[];
  total: number;
}

export interface APISearchBranchResponse {
  data: Branches[];
}

// create
export interface CreateBranch {
  name: string;
  address: string;
}

// update
export type UpdateBranch = Partial<CreateBranch>;

export const branchService = {
  getAll: async (): Promise<APIBranchResponse | undefined> => {
    const response = await api.get("/api/branches/get-all-branches");
    return response.data;
  },

  search: async (keyword: string): Promise<APISearchBranchResponse> => {
    const response = await api.get("/api/branches/search-branch", {
      params: { keyword },
    });
    return response.data;
  },

  create: (data: CreateBranch) => {
    return api.post("/api/branches/create-branch", data);
  },

  update: (id: string, data: UpdateBranch) => {
    return api.put(`/api/branches/update-branch/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete(`/api/branches/delete-branch/${id}`);
  },
};
