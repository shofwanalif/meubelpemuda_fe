import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { branchService } from "@/services/branch.service";
import type { CreateBranch, UpdateBranch } from "@/services/branch.service";

export function useGetAllBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: () => branchService.getAll(),
  });
}

export function useSearchBranches(keyword: string) {
  return useQuery({
    // membuat cache terpisah dan melakukan fetch ulang ke server.
    queryKey: ["branches", "search", keyword],
    queryFn: () => branchService.search(keyword),

    // OPTIMASI: Query ini HANYA akan menembak API jika keyword ada isinya (tidak kosong).
    enabled: !!keyword,
  });
}

// mutation
export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBranch) => branchService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    // Karena butuh 2 parameter (id dan data), kita bungkus ke dalam 1 objek 'payload'
    mutationFn: (payload: { id: string; data: UpdateBranch }) =>
      branchService.update(payload.id, payload.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}
