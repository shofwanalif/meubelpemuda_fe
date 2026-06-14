"use client";

import { useState } from "react";
import { Typography } from "antd";

// Hooks & Services
import { SalesSummaryParams } from "@/services/sale.service";
import {
  useGetSalesSummary,
  useGetSalesMonthly,
} from "@/hooks/queries/useSale";
import { useGetAllBranches } from "@/hooks/queries/useBranch";
import { useUserSession } from "@/hooks/queries/useAuth"; // Session hook kita sebelumnya

// Components
import { StatsCards } from "./components/StatsCards";
import { DashboardFilters } from "./components/DashboardFilters";
import { SalesMonthlyChart } from "./components/SalesMonthlyChart";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { data: session } = useUserSession();
  const isOwner = session?.user.role === "owner";

  // Nilai awal untuk reset
  const initialParams: SalesSummaryParams = {
    startDate: undefined,
    endDate: undefined,
    branchId: undefined,
  };

  const [params, setParams] = useState<SalesSummaryParams>(initialParams);

  const { data: summary, isLoading: loadingSummary } =
    useGetSalesSummary(params);
  const { data: branches } = useGetAllBranches();
  const { data: summaryMonthly, isLoading: loadingSummaryMonthly } =
    useGetSalesMonthly();

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
          Selamat datang kembali,{" "}
          <span className="font-bold">{session?.user.name}</span>. Berikut
          ringkasan bisnismu.
        </Text>
      </div>

      <DashboardFilters
        isOwner={isOwner}
        branches={branches?.data}
        onFilterChange={handleFilterChange}
        onReset={handleReset} // Pasang prop reset
      />

      {summary?.period && (
        <div className="mb-4">
          <Text>
            Periode:{"  "}
            <Text type="secondary">
              {new Date(summary.period.startDate).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              -{" "}
              {new Date(summary.period.endDate).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Text>
        </div>
      )}

      <StatsCards data={summary} loading={loadingSummary} />

      <div className="mt-8">
        <SalesMonthlyChart
          data={summaryMonthly}
          loading={loadingSummaryMonthly}
        />
      </div>
    </div>
  );
}
