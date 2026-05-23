"use client";

import { useState } from "react";
import { Typography, Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

// Services & Hooks
import {
  useGetAllEmployees,
  useCreateEmployee,
  useAssignBranch,
} from "@/hooks/queries/useUsers";
import type { Employee } from "@/services/user.service";
import { useGetAllBranches } from "@/hooks/queries/useBranch";
import { useNotification } from "@/hooks/useMessage";

// Components
import { UserTable } from "./components/UserTable";
import { CreateUserModal } from "./components/CreateUserModal";
import { AssignBranchModal } from "./components/AssignBranchModal";

const { Title } = Typography;

export default function UserPage() {
  const notification = useNotification();

  // Modals State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);

  // Queries
  const { data: employees, isLoading: loadingEmp } = useGetAllEmployees();
  const { data: branches } = useGetAllBranches();

  // Mutations
  const { mutate: createEmp, isPending: creating } = useCreateEmployee();
  const { mutate: assignBranch, isPending: assigning } = useAssignBranch();

  // Handlers
  const handleCreate = (values: any) => {
    createEmp(values, {
      onSuccess: () => {
        notification.success({ message: "Karyawan berhasil ditambah" });
        setIsAddOpen(false);
      },
    });
  };

  const handleAssign = (values: { userId: string; branchId: string }) => {
    assignBranch(values, {
      onSuccess: () => {
        notification.success({ message: "Cabang berhasil diassign" });
        setIsAssignOpen(false);
      },
    });
  };

  const openAssignModal = (user: Employee) => {
    setSelectedUser(user);
    setIsAssignOpen(true);
  };

  return (
    <div className="md:px-6 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Title level={3} className="mb-0">
            Daftar Karyawan
          </Title>
          <Typography.Text type="secondary">
            Manajemen akun dan penempatan tugas cabang
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => setIsAddOpen(true)}
        >
          Tambah Karyawan
        </Button>
      </div>

      <UserTable
        data={employees?.data}
        loading={loadingEmp}
        onAssignClick={openAssignModal}
      />

      <CreateUserModal
        open={isAddOpen}
        branches={branches?.data}
        loading={creating}
        onCancel={() => setIsAddOpen(false)}
        onFinish={handleCreate}
      />

      <AssignBranchModal
        open={isAssignOpen}
        user={selectedUser}
        branches={branches?.data}
        loading={assigning}
        onCancel={() => setIsAssignOpen(false)}
        onFinish={handleAssign}
      />
    </div>
  );
}
