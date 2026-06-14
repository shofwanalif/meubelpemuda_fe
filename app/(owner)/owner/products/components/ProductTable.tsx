"use client";

import { Table, Space, Button, Popconfirm, Tooltip, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
}

const formatRp = (val: string | number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(val));

export function ProductTable({
  data,
  loading,
  meta,
  onPageChange,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const columns: ColumnsType<Product> = [
    {
      title: "Nama Produk",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Cabang",
      dataIndex: ["branch", "name"],
      key: "branch",
      width: 150,
      render: (name) => name || "-",
    },
    {
      title: "Kategori",
      dataIndex: ["category", "name"],
      key: "category",
      width: 150,
      render: (name) => name || "-",
    },
    {
      title: "Stok",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      align: "center",
      render: (stock) => stock ?? 0,
    },
    {
      title: "Harga Modal",
      dataIndex: ["activePrice", "costPrice"],
      key: "costPrice",
      width: 150,
      align: "right",
      render: (val) => (val ? formatRp(val) : "-"),
    },
    {
      title: "Harga Jual",
      dataIndex: ["activePrice", "sellPrice"],
      key: "sellPrice",
      width: 150,
      align: "right",
      render: (val) => (val ? formatRp(val) : "-"),
    },
    {
      title: "Aksi",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ubah Data">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Hapus permanen">
            <Popconfirm
              title="Hapus permanen?"
              onConfirm={() => onDelete(record.id)}
              okText="Ya"
              cancelText="Tidak"
            >
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        bordered
        scroll={{ x: 1100 }}
        pagination={false}
      />
    </div>
  );
}
