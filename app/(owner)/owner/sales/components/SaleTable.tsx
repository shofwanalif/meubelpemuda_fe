"use client";

import {
  Table,
  Tag,
  Typography,
  Button,
  Tooltip,
  Space,
  Popconfirm,
} from "antd";
import { EyeOutlined, CloseOutlined } from "@ant-design/icons";
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
  onCancelSale: (id: string) => void;
}

export function SaleTable({
  data,
  loading,
  meta,
  onPageChange,
  onCancelSale,
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
      title: "Catatan",
      dataIndex: "notes",
      key: "notes",
      render: (notes: string) => <Text>{notes || "-"}</Text>,
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      key: "customer",
    },
    {
      title: "Total Penjualan",
      dataIndex: "totalSell",
      key: "totalSell",
      align: "right",
      render: (val: number) => <Text>{formatRp(val)}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status.toLowerCase() === "completed" ? "green" : "red"}>
          {status.toLowerCase() === "completed" ? "SELESAI" : "DIBATALKAN"}
        </Tag>
      ),
      align: "right",
    },
    {
      title: "Aksi",
      key: "action",
      align: "center",
      width: 140,
      render: (_, record) => (
        <Space>
          <Tooltip title="Lihat Detail Transaksi">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/owner/sales/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Batalkan Transaksi">
            <Popconfirm
              title="Konfirmasi Pembatalan"
              description="Apakah Anda yakin ingin membatalkan transaksi ini?"
              onConfirm={() => {
                onCancelSale(record.id);
              }}
              okText="Ya, Batalkan"
              cancelText="Tidak"
              disabled={record.status.toLowerCase() === "cancelled"}
            >
              <Button
                danger
                type="primary"
                icon={<CloseOutlined />}
                disabled={record.status.toLowerCase() === "cancelled"}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
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
      pagination={false}
      scroll={{ x: 1000 }}
    />
  );
}
