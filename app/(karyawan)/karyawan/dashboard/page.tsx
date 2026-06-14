"use client";

import { useState } from "react";
import { Typography } from "antd";

// Hooks & Services
import { SalesSummaryParams } from "@/services/sale.service";
import { useGetSalesSummary } from "@/hooks/queries/useSale";

// Components
import { StatsCards } from "./components/StatsCards";
import { DashboardFilters } from "./components/DashboardFilter";

const { Title, Text } = Typography;

export default function DashboardPage() {
  // Nilai awal untuk reset
  const initialParams: SalesSummaryParams = {
    startDate: undefined,
    endDate: undefined,
    branchId: undefined,
  };

  const [params, setParams] = useState<SalesSummaryParams>(initialParams);

  const { data: summary, isLoading: loadingSummary } =
    useGetSalesSummary(params);

  // Handler untuk update state sebagian (saat pilih tanggal atau cabang)
  const handleFilterChange = (newValues: Partial<SalesSummaryParams>) => {
    setParams((prev) => ({ ...prev, ...newValues }));
  };

  // Handler untuk reset total
  const handleReset = () => {
    setParams(initialParams);
  };

  return (
    <div className="md:px-6 mx-auto">
      {/* ... Header ... */}
      <div className="mb-8">
        <Title level={2} className="mb-1">
          Dashboard
        </Title>
        <Text type="secondary">
          Selamat datang kembali, Berikut ringkasan penjualan cabang
        </Text>
      </div>

      <DashboardFilters
        onFilterChange={handleFilterChange}
        onReset={handleReset} // Pasang prop reset
      />

      <StatsCards data={summary} loading={loadingSummary} />
    </div>
  );
}
