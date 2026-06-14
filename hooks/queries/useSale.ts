import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesService, SaleParams } from "@/services/sale.service";
import type {
  SalesSummaryParams,
  CreateSalePayload,
} from "@/services/sale.service";

export function useGetSalesSummary(params: SalesSummaryParams) {
  return useQuery({
    // Jika user mengubah tanggal di filter, query ini otomatis jalan ulang (refetch).
    queryKey: ["sales", "summary", params],
    queryFn: () => salesService.getSummary(params),

    staleTime: 5 * 60 * 1000, // 5 menit
  });
}

export function useGetSalesMonthly() {
  return useQuery({
    queryKey: ["sales", "monthly"],
    queryFn: () => salesService.getMonthlySummary(),
  });
}

export function useGetSales(params: SaleParams) {
  return useQuery({
    queryKey: ["sales", params],
    queryFn: () => salesService.getAll(params),
  });
}

export function useGetSaleDetail(id: string) {
  return useQuery({
    queryKey: ["sales", id],
    queryFn: () => salesService.getById(id),
    // Query hanya akan berjalan jika id tidak kosong/null
    enabled: !!id,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSalePayload) => salesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales", "summary"] });
    },
  });
}

export function useCancelSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => salesService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
