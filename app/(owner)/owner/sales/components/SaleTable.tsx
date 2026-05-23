"use client";

import { Table, Tag, Typography, Button, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { PaginationMeta } from "@/services/product.service";
import { Sale } from "@/services/sale.service";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface SaleTableProps {
  data: Sale[] | undefined;
  loading: boolean;
  meta?: PaginationMeta;
  onPageChange: (page: number, pageSize: number) => void;
}

export function SaleTable({
  data,
  loading,
  meta,
  onPageChange,
}: SaleTableProps) {
  const router = useRouter();

  const formatRp = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const columns: ColumnsType<Sale> = [
    {
      title: "Waktu Transaksi",
      dataIndex: "saleDate",
      key: "saleDate",
      width: 180,
      render: (date: string) => (
        <div className="flex flex-col">
          <Text strong>{dayjs(date).format("DD MMM YYYY")}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {dayjs(date).format("HH:mm")}
          </Text>
        </div>
      ),
    },
    {
      title: "Cabang",
      dataIndex: ["branch", "name"],
      key: "branch",
      render: (name: string) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: "Kasir",
      dataIndex: ["createdBy", "name"],
      key: "cashier",
    },
    {
      title: "Item",
      dataIndex: "itemCount",
      key: "itemCount",
      align: "center",
      render: (count: number) => <Text>{count} Jenis</Text>,
    },
    {
      title: "Total Penjualan",
      dataIndex: "totalSell",
      key: "totalSell",
      align: "right",
      render: (val: number) => <Text>{formatRp(val)}</Text>,
    },
    {
      title: "Laba Kotor",
      dataIndex: "grossProfit",
      key: "grossProfit",
      align: "right",
      render: (val: number) => <Text>{formatRp(val)}</Text>,
    },
    {
      title: "Aksi",
      key: "action",
      align: "center",
      width: 140,
      render: (_, record) => (
        <Tooltip title="Lihat Detail Transaksi">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/owner/sales/${record.id}`)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      bordered
      pagination={{
        current: meta?.current_page,
        pageSize: meta?.page_size,
        total: meta?.total,
        onChange: onPageChange,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} transaksi`,
      }}
      scroll={{ x: 1000 }}
    />
  );
}
