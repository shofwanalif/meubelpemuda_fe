import { api } from "@/lib/axios";

// Interface Pendukung (Nested Data)
export interface BranchSummary {
  id: string;
  name: string;
}

export interface EmployeeBranch {
  id: string;
  assignedAt: string;
  userId: string;
  branchId: string;
  branch: BranchSummary;
}

// 2. Interface Utama Employee
export interface Employee {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: "owner" | "karyawan";
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  employeeBranch: EmployeeBranch | null;
}

export interface APIEmployeeResponse {
  message: string;
  data: Employee[];
}

export interface CreateEmployee {
  email: string;
  password: string;
  name: string;
  branchId?: string;
}

export interface AssignBranch {
  userId: string;
  branchId: string;
}

export const userService = {
  getAllEmployees: async (): Promise<APIEmployeeResponse> => {
    // Sesuaikan endpoint ini dengan backend Express kamu
    const response = await api.get("/api/users/list-users");
    return response.data;
  },

  createEmployee: (data: CreateEmployee) => {
    return api.post("/api/users/create-user", data);
  },

  assignBranch: (data: AssignBranch) => {
    return api.post("/api/users/assign-branch", data);
  },
};
