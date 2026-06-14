"use client";

import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Tooltip,
  Typography,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Category } from "@/services/category.service";
import type { ColumnsType } from "antd/es/table";
import { PaginationMeta } from "@/services/product.service";

const { Text } = Typography;

interface CategoryTableProps {
  data: Category[] | undefined;
  meta?: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (record: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryTable({
  data,
  meta,
  loading,
  onPageChange,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const columns: ColumnsType<Category> = [
    {
      title: "Nama Kategori",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Cabang",
      dataIndex: ["branch", "name"],
      key: "branch",
      render: (name) => name || "-",
    },

    {
      title: "Aksi",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Hapus">
            <Popconfirm
              title="Yakin hapus kategori ini?"
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
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      bordered
      scroll={{ x: 800 }}
      pagination={false}
    />
  );
}
