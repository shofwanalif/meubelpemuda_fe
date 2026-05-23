"use client";

import { useState } from "react";
import { Typography, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

// Hooks & Services
import {
  useGetAllBranches,
  useSearchBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
} from "@/hooks/queries/useBranch";
import type { Branches } from "@/services/branch.service";
import { useNotification } from "@/hooks/useMessage";
import { useDebounce } from "@/hooks/useDebounce";

// Components
import { BranchModal } from "./components/BranchModal";
import { BranchTable } from "./components/BranchTable";

const { Title } = Typography;

export default function BranchPage() {
  const notification = useNotification();

  // --- STATE ---
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branches | null>(null);

  // --- SEARCH LOGIC ---
  const debouncedSearch = useDebounce(searchText, 500);

  // --- DATA QUERIES ---
  const { data: allBranches, isLoading: loadingAll } = useGetAllBranches();
  const { data: searchResults, isLoading: loadingSearch } =
    useSearchBranches(debouncedSearch);

  const displayData = debouncedSearch ? searchResults?.data : allBranches?.data;
  const isTableLoading = debouncedSearch ? loadingSearch : loadingAll;

  // --- MUTATIONS ---
  const { mutate: createBranch, isPending: creating } = useCreateBranch();
  const { mutate: updateBranch, isPending: updating } = useUpdateBranch();
  const { mutate: deleteBranch } = useDeleteBranch();

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: Branches) => {
    setEditingBranch(record);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: any) => {
    const options = {
      onSuccess: () => {
        notification.success({
          title: editingBranch ? "Cabang Diperbarui" : "Cabang Ditambahkan",
        });
        setIsModalOpen(false);
      },
      onError: (err: any) => notification.error({ message: err.message }),
    };

    if (editingBranch) {
      updateBranch({ id: editingBranch.id, data: values }, options);
    } else {
      createBranch(values, options);
    }
  };

  const handleDelete = (id: string) => {
    deleteBranch(id, {
      onSuccess: () => notification.success({ message: "Cabang dihapus" }),
    });
  };

  return (
    <div className="md:px-6 mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Title level={3}>List Cabang</Title>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenAdd}
        >
          Tambah Cabang
        </Button>
      </div>

      {/* Filter Section */}
      <div className="flex justify-end mb-6 ">
        <Input
          placeholder="Cari berdasarkan nama...."
          prefix={<SearchOutlined className="text-gray-400" />}
          size="large"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Table Section - Sekarang dipisah */}
      <BranchTable
        dataSource={displayData}
        loading={isTableLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Modal Section - Sekarang dipisah */}
      <BranchModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onFinish={handleSubmit}
        loading={creating || updating}
        initialValues={editingBranch}
      />
    </div>
  );
}
