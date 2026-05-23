import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  productService,
  ProductParams,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/services/product.service";

export function useGetProducts(params: ProductParams) {
  return useQuery({
    // Setiap kali page, pageSize, atau filter berubah, React Query akan refetch
    queryKey: ["products", params],
    queryFn: () => productService.getAll(params),
    staleTime: 60 * 1000,
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

export function useDeactivateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useActivateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
