"use client";

import { useState } from "react";
import { Typography, Button, Input, Select, Space, Pagination } from "antd";
import {
  PlusOutlined,
  // SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/queries/useCategories";
import { useGetAllBranches } from "@/hooks/queries/useBranch";
// import { useDebounce } from "@/hooks/useDebounce";
import { useNotification } from "@/hooks/useMessage";

import { CategoryTable } from "./components/CategoryTable";
import { CategoryModal } from "./components/CategoryModal";

const { Title } = Typography;

export default function OwnerCategoryPage() {
  const notification = useNotification();

  // State filter & pagination
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    branchId: undefined as string | undefined,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // const debouncedSearch = useDebounce(params.search, 500);

  // Queries
  const { data: catRes, isLoading } = useGetCategories({
    page: params.page,
    limit: params.limit,
    // search: debouncedSearch,
    branchId: params.branchId,
  });
  const { data: branches } = useGetAllBranches();

  // Mutations
  const { mutate: createCat, isPending: creating } = useCreateCategory();
  const { mutate: updateCat, isPending: updating } = useUpdateCategory();
  const { mutate: deleteCat } = useDeleteCategory();

  // Handlers
  const handlePageChange = (page: number, pageSize: number) => {
    setParams((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleBranchChange = (value: string | undefined) => {
    setParams((prev) => ({ ...prev, branchId: value, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleReset = () => {
    setParams({
      page: 1,
      limit: 10,
      search: "",
      branchId: undefined,
    });
  };

  const handleSubmit = (values: { name: string; branchId?: string }) => {
    const options = {
      onSuccess: () => {
        notification.success({
          message: selectedCategory
            ? "Kategori berhasil diperbarui"
            : "Kategori berhasil ditambahkan",
        });
        setIsModalOpen(false);
        setSelectedCategory(null);
      },
      onError: (error: any) => {
        notification.error({
          message: "Gagal menyimpan kategori",
          description: error?.response?.data?.message || error.message,
        });
      },
    };

    if (selectedCategory) {
      updateCat(
        { id: selectedCategory.id, payload: { name: values.name } },
        options,
      );
    } else {
      createCat(values, options);
    }
  };

  const handleEdit = (record: any) => {
    setSelectedCategory(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCat(id, {
      onSuccess: () => {
        notification.success({ message: "Kategori berhasil dihapus" });
      },
      onError: (error: any) => {
        notification.error({
          message: "Gagal menghapus kategori",
          description: error?.response?.data?.message || error.message,
        });
      },
    });
  };

  return (
    <div className="md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Title level={3}>Daftar Kategori</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
        >
          Tambah Kategori
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
        <Space wrap>
          <Select
            placeholder="Filter Cabang"
            allowClear
            style={{ width: 200 }}
            value={params.branchId}
            onChange={handleBranchChange}
            options={branches?.data?.map((b) => ({
              label: b.name,
              value: b.id,
            }))}
          />
          {/* <Input
            placeholder="Cari kategori..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            allowClear
            onChange={handleSearchChange}
            value={params.search}
          /> */}
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            type="primary"
          >
            Reset
          </Button>
        </Space>
      </div>

      <CategoryTable
        data={catRes?.data}
        meta={catRes?.meta}
        loading={isLoading}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="mt-4 flex flex-wrap justify-end items-center gap-2">
        <Pagination
          current={catRes?.meta?.current_page ?? 1}
          pageSize={catRes?.meta?.page_size ?? 10}
          total={catRes?.meta?.total ?? 0}
          showSizeChanger={false}
          size="small"
          showTotal={(total) => `Total ${total} kategori`}
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
          // style={{ width: 130 }}
        />
      </div>

      <CategoryModal
        open={isModalOpen}
        initialValues={selectedCategory}
        branches={branches?.data}
        loading={creating || updating}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onFinish={handleSubmit}
      />
    </div>
  );
}
