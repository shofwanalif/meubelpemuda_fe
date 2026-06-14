"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Card,
  Col,
  Row,
  DatePicker,
  Select,
  Button,
  Pagination,
  Input, // <-- tambahan
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"; // <-- tambahan SearchOutlined
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

// Hooks & Services
import { useGetSales, useCancelSale } from "@/hooks/queries/useSale";
import { useDebounce } from "@/hooks/useDebounce";
import { useNotification } from "@/hooks/useMessage";

// Components
import { SaleTable } from "./components/SaleTable";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function KaryawanSalesPage() {
  // --- STATE ---
  const [params, setParams] = useState<{
    page: number;
    limit: number;
    search: string;
    branchId: string | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
  }>({
    page: 1,
    limit: 10,
    search: "",
    branchId: undefined,
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  const router = useRouter();
  const notification = useNotification();
  const debouncedSearch = useDebounce(params.search, 500);

  // --- QUERIES ---
  const { data: saleRes, isLoading: tableLoading } = useGetSales({
    ...params,
    search: debouncedSearch,
  });
  const { mutate: cancelSale } = useCancelSale();

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  // --- HANDLERS ---
  const handlePageChange = (page: number, pageSize: number) => {
    setParams((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
      setParams((prev) => ({
        ...prev,
        startDate: dates[0]!.format("YYYY-MM-DD"),
        endDate: dates[1]!.format("YYYY-MM-DD"),
        page: 1,
      }));
    } else {
      setDateRange(null);
      setParams((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
        page: 1,
      }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleCancelSale = (id: string) => {
    cancelSale(id, {
      onSuccess: () => {
        notification.success({
          title: "Transaksi Berhasil Dibatalkan",
          description: "Status transaksi telah diubah",
        });
      },
      onError: (error: any) => {
        notification.error({
          title: "Gagal Membatalkan Transaksi",
          description:
            error?.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan",
        });
      },
    });
  };

  return (
    <div className="md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Title level={3}>Riwayat Transaksi</Title>
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
        <div className="flex flex-col items-end md:flex-row justify-between gap-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col">
              <Text type="secondary" className="mb-2 gap-2">
                Filter Rentang Tanggal
              </Text>
              <RangePicker
                className="w-full md:w-auto"
                size="large"
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </div>

            <Button
              type="primary"
              size="large"
              onClick={() => {
                const newStart = dayjs().startOf("month");
                const newEnd = dayjs().endOf("month");
                setDateRange([newStart, newEnd]);
                setParams((prev) => ({
                  ...prev,
                  startDate: newStart.format("YYYY-MM-DD"),
                  endDate: newEnd.format("YYYY-MM-DD"),
                  search: "",
                  page: 1,
                }));
              }}
            >
              Reset Filter
            </Button>
          </div>
          <div className="w-full md:w-64">
            <Input
              placeholder="Cari transaksi..."
              prefix={<SearchOutlined />}
              size="large"
              allowClear
              onChange={handleSearchChange}
              value={params.search}
            />
          </div>
        </div>

        <SaleTable
          data={saleRes?.data}
          meta={saleRes?.meta}
          loading={tableLoading}
          onPageChange={handlePageChange}
          onCancelSale={handleCancelSale}
        />

        <div className="mt-4 flex flex-wrap justify-end items-center gap-2">
          <Pagination
            current={saleRes?.meta?.current_page ?? 1}
            pageSize={saleRes?.meta?.page_size ?? 10}
            total={saleRes?.meta?.total ?? 0}
            showSizeChanger={false}
            size="small"
            showTotal={(total) => `Total ${total} transaksi`}
            onChange={handlePageChange}
          />
          <Select
            value={params.limit}
            onChange={(value) => handlePageChange(1, value)}
            size="small"
            options={[
              { label: "10 / page", value: 10 },
              { label: "20 / page", value: 20 },
              { label: "50 / page", value: 50 },
              { label: "100 / page", value: 100 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
