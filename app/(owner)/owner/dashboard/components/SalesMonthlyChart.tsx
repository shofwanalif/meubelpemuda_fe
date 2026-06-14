"use client";

import { Line } from "@ant-design/plots";
import { Card, Spin, Empty, Tooltip } from "antd";
import { SalesSummaryMonthlyData } from "@/services/sale.service";

interface SalesMonthlyChartProps {
  data: SalesSummaryMonthlyData[] | undefined;
  loading?: boolean;
}

export function SalesMonthlyChart({ data, loading }: SalesMonthlyChartProps) {
  const chartData =
    data?.flatMap((item) => [
      {
        month: item.period, // "2026-01"
        value: Number(item.totalRevenue),
        category: "Total Pendapatan",
      },
      {
        month: item.period,
        value: Number(item.totalGrossProfit),
        category: "Total Laba Kotor",
      },
    ]) ?? [];

  const config = {
    data: chartData,
    xField: "month",
    yField: "value",
    shapeField: "smooth",
    seriesField: "category",
    smooth: true,
    animation: true,
    colorField: "category",
    interaction: {
      tooltip: {
        marker: "false",
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `Rp ${Number(v).toLocaleString("id-ID")}`,
      },
      title: {
        text: "Jumlah (IDR)",
      },
    },
    xAxis: {
      title: {
        text: "Bulan",
      },
    },
    point: {
      size: 4,
      shape: "circle",
      tooltip: false,
    },
    loading: loading,
  };

  if (loading) {
    return (
      <Card className="w-full">
        <div className="flex justify-center items-center h-80">
          <Spin description="Memuat grafik..." />
        </div>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="w-full">
        <Empty description="Tidak ada data bulanan" />
      </Card>
    );
  }

  return (
    <Card
      title="Tren Pendapatan & Laba Kotor Bulanan 6 bulan terakhir"
      className="w-full"
    >
      <Line {...config} />
    </Card>
  );
}
