import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoryService,
  CategoryParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/services/category.service";

// GET all categories (dengan filter & pagination)
export function useGetCategories(
  params: CategoryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryService.getAll(params),
    ...options,
  });
}

// CREATE category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// UPDATE category
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => categoryService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// DELETE category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
