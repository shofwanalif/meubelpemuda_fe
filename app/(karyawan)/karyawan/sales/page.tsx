"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Card, Col, Row, DatePicker, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { RangePickerProps } from "antd/es/date-picker";

// Hooks & Services
import { useGetSales } from "@/hooks/queries/useSale";
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
    startDate: string | undefined;
    endDate: string | undefined;
  }>({
    page: 1,
    pageSize: 10,
    search: "",
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Title level={3}>Riwayat Penjualan</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => router.push("/karyawan/sales/create")}
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
