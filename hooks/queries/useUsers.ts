import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { CreateEmployee, AssignBranch } from "@/services/user.service";

export function useGetAllEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => userService.getAllEmployees(),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployee) => userService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useAssignBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignBranch) => userService.assignBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });

      // Opsional: Jika kamu punya list cabang yang menampilkan jumlah karyawan,
      // kamu juga bisa invalidate query branches di sini
      // queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}
