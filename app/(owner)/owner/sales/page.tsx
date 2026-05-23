"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Card, Col, Row, DatePicker, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { RangePickerProps } from "antd/es/date-picker";

// Hooks & Services
import { useGetSales } from "@/hooks/queries/useSale";
import { useGetAllBranches } from "@/hooks/queries/useBranch";
import { useDebounce } from "@/hooks/useDebounce";

// Components
import { SaleTable } from "./components/SaleTable";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function OwnerSalesPage() {
  // --- STATE ---
  const [params, setParams] = useState<{
    page: number;
    pageSize: number;
    search: string;
    branchId: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
  }>({
    page: 1,
    pageSize: 10,
    search: "",
    branchId: undefined,
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  const router = useRouter();

  const debouncedSearch = useDebounce(params.search, 500);

  // --- QUERIES ---
  const { data: saleRes, isLoading: tableLoading } = useGetSales({
    ...params,
    search: debouncedSearch,
  });

  const { data: branchRes } = useGetAllBranches();

  // --- HANDLERS ---
  const handlePageChange = (page: number, pageSize: number) => {
    setParams((prev) => ({ ...prev, page, pageSize }));
  };

  const handleDateRangeChange: RangePickerProps["onChange"] = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setParams((prev) => ({
        ...prev,
        startDate: dates[0]!.format("YYYY-MM-DD"),
        endDate: dates[1]!.format("YYYY-MM-DD"),
        page: 1,
      }));
    } else {
      setParams((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      }));
    }
  };

  return (
    <div className="md:px-6">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Title level={3}>Riwayat Transaksi</Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => router.push("/owner/sales/create")}
        >
          Transaksi Baru
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {/* --- SECTION: FILTERS --- */}
        <Card variant="borderless">
          <Row gutter={[12, 12]} align="bottom">
            <Col xs={24} md={8}>
              <Text strong className="block mb-2">
                Rentang Tanggal
              </Text>
              <RangePicker
                className="w-full"
                size="large"
                defaultValue={[
                  dayjs().startOf("month"),
                  dayjs().endOf("month"),
                ]}
                onChange={handleDateRangeChange}
              />
            </Col>
            <Col xs={24} md={6}>
              <Text strong className="block mb-2">
                Filter Cabang
              </Text>
              <Select
                className="w-full"
                size="large"
                placeholder="Semua Cabang"
                allowClear
                value={params.branchId}
                onChange={(val) =>
                  setParams((prev) => ({ ...prev, branchId: val, page: 1 }))
                }
              >
                {branchRes?.data?.map((b) => (
                  <Select.Option key={b.id} value={b.id}>
                    {b.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setParams((prev) => ({
                    ...prev,
                    branchId: undefined,
                    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
                    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
                    search: "",
                    page: 1,
                  }));
                }}
              >
                Reset Filter
              </Button>
            </Col>
          </Row>
        </Card>

        <SaleTable
          data={saleRes?.data}
          meta={saleRes?.meta}
          loading={tableLoading}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
