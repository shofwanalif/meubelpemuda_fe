"use client";

import { Table, Space, Tag, Popconfirm, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Branches } from "@/services/branch.service";
import { ColumnsType } from "antd/es/table";

interface BranchTableProps {
  dataSource: Branches[] | undefined;
  loading: boolean;
  onEdit: (record: Branches) => void;
  onDelete: (id: string) => void;
}

export function BranchTable({
  dataSource,
  loading,
  onEdit,
  onDelete,
}: BranchTableProps) {
  const columns: ColumnsType<Branches> = [
    {
      title: "Nama Cabang",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Alamat",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      //   width: 120,
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Aktif" : "Non-Aktif"}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined className="text-blue-500" />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Hapus Cabang"
            onConfirm={() => onDelete(record.id)}
            okText="Ya"
            cancelText="Tidak"
            okButtonProps={{ danger: true }}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      bordered
      // --- INI KUNCINYA UNTUK RESPONSIF ---
      scroll={{ x: 800 }}
    />
  );
}
