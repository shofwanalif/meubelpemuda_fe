import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  productService,
  ProductParams,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/services/product.service";

// hooks/queries/useProduct.ts
export function useGetProducts(
  params: ProductParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getAll(params),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductPayload) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateProductPayload }) =>
      productService.update(payload.id, payload.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
