"use client";

import { Table, Tag, Space, Button, Tooltip, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Product, PaginationMeta } from "@/services/product.service";
import { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface ProductTableProps {
  data: Product[] | undefined;
  loading: boolean;
  meta?: PaginationMeta;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (record: Product) => void;
  onDelete: (id: string) => void;
  onDeactivate: (id: string) => void;
  onActivate: (id: string) => void;
}

export function ProductTable({
  data,
  loading,
  meta,
  onPageChange,
  onEdit,
}: ProductTableProps) {
  const formatRp = (val: string | number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val));

  const columns: ColumnsType<Product> = [
    {
      title: "Nama Produk",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 100,
      align: "center",
    },
    {
      title: "Harga Modal",
      key: "costPrice",
      width: 150,
      align: "right",
      render: (_, record) => {
        // Akses record.price (objek tunggal untuk karyawan)
        return record.price ? (
          formatRp(record.price.costPrice)
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    },
    {
      title: "Harga Jual",
      key: "sellPrice",
      width: 150,
      align: "right",
      render: (_, record) => {
        return record.price ? (
          <Text>{formatRp(record.price.sellPrice)}</Text>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    },
    {
      title: "Sumber Harga",
      key: "source",
      width: 120,
      align: "center",
      render: (_, record) => {
        if (!record.price?.source) return "-";
        const isBranch = record.price.source === "branch";
        return (
          <Tag color={isBranch ? "blue" : "orange"}>
            {isBranch ? "Cabang" : "Global"}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      width: 120,
      align: "center",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Aktif" : "Non-Aktif"}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Data">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
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
      scroll={{ x: 1000 }}
      pagination={{
        current: meta?.current_page,
        pageSize: meta?.page_size,
        total: meta?.total,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
        onChange: onPageChange,
        showTotal: (total) => `Total ${total} produk`,
      }}
    />
  );
}
