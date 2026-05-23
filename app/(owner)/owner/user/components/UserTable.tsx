"use client";

import { Table, Tag, Button, Tooltip } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import { Employee } from "@/services/user.service";
import { ColumnsType } from "antd/es/table";

interface UserTableProps {
  data: Employee[] | undefined;
  loading: boolean;
  onAssignClick: (user: Employee) => void;
}

export function UserTable({ data, loading, onAssignClick }: UserTableProps) {
  const columns: ColumnsType<Employee> = [
    { title: "Nama", dataIndex: "name", key: "name", width: 300 },
    { title: "Email", dataIndex: "email", key: "email", width: 300 },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (role) => <Tag color="blue">{role.toUpperCase()}</Tag>,
    },
    {
      title: "Cabang",
      dataIndex: "employeeBranch",
      key: "branch",
      render: (eb) =>
        eb ? (
          <Tag color="green">{eb.branch.name}</Tag>
        ) : (
          <Tag color="default">Belum Ada</Tag>
        ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Tooltip title="Assign ke Cabang">
          <Button
            type="primary"
            icon={<ApartmentOutlined />}
            onClick={() => onAssignClick(record)}
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
      pagination={{ pageSize: 10 }}
      scroll={{ x: 800 }}
      bordered
    />
  );
}
