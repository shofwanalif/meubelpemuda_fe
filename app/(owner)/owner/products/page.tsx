"use client";

import { useState } from "react";
import { Typography, Button, Input, Select, Pagination } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

// Hooks & Services
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/queries/useProduct";
import { useGetCategories } from "@/hooks/queries/useCategories";
import { Product } from "@/services/product.service";
import { useGetAllBranches } from "@/hooks/queries/useBranch";
import { useNotification } from "@/hooks/useMessage";
import { useDebounce } from "@/hooks/useDebounce";

// Components
import { ProductTable } from "./components/ProductTable";
import { ProductModal } from "./components/ProductModal";

const { Title } = Typography;

export default function OwnerProductPage() {
  const notification = useNotification();

  // --- STATE ---
  const [params, setParams] = useState({ page: 1, limit: 10, search: "" });
  const [branchFilter, setBranchFilter] = useState<string | undefined>(
    undefined,
  );
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- SEARCH LOGIC ---
  const debouncedSearch = useDebounce(params.search, 500);

  // --- QUERIES ---
  const { data: productRes, isLoading } = useGetProducts({
    page: params.page,
    limit: params.limit,
    search: debouncedSearch,
    branchId: branchFilter,
    categoryId: categoryFilter,
  });
  const { data: branches } = useGetAllBranches();
  const { data: categoriesRes } = useGetCategories(
    {
      page: 1,
      limit: 999,
      branchId: branchFilter,
    },
    { enabled: !!branchFilter },
  );

  // --- MUTATIONS ---
  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  // --- HANDLERS ---
  const handlePageChange = (page: number, pageSize: number) => {
    setParams((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id, {
      onSuccess: () => {
        notification.success({
          title: "Produk Berhasil Dihapus",
          description: "Produk telah berhasil dihapus",
        });
      },
      onError: (error: any) => {
        notification.error({
          title: "Gagal Membatalkan Transaksi",
          description:
            error?.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan",
        });
      },
    });
  };

  const handleBranchChange = (value: string | undefined) => {
    setBranchFilter(value);
    setCategoryFilter(undefined);
    setParams((prev) => ({ ...prev, page: 1 }));
  };

  const handleCategoryChange = (value: string | undefined) => {
    setCategoryFilter(value);
    setParams((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleResetFilters = () => {
    setBranchFilter(undefined);
    setCategoryFilter(undefined);
    setParams({ page: 1, limit: 10, search: "" });
  };

  const handleSubmit = (values: any) => {
    const options = {
      onSuccess: () => {
        notification.success({
          title: selectedProduct ? "Produk diperbarui" : "Produk ditambahkan",
        });
        setIsModalOpen(false);
      },
      onError: (error: any) => {
        notification.error({
          title: "Gagal Menambahkan/Memperbarui Data",
          description:
            error?.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan",
        });
      },
    };

    if (selectedProduct) {
      updateProduct({ id: selectedProduct.id, data: values }, options);
    } else {
      createProduct(values, options);
    }
  };

  const branchOptions =
    branches?.data?.map((branch) => ({
      label: branch.name,
      value: branch.id,
    })) ?? [];

  const categoryOptions =
    categoriesRes?.data?.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })) ?? [];

  return (
    <div className="md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Title level={3}>Katalog Produk (Owner)</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
        >
          Tambah Produk
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            placeholder="Semua Cabang"
            allowClear
            style={{ width: 200 }}
            onChange={handleBranchChange}
            value={branchFilter}
            options={branchOptions}
          />
          <Select
            placeholder="Semua Kategori"
            allowClear
            style={{ width: 200 }}
            onChange={handleCategoryChange}
            value={categoryFilter}
            options={categoryOptions}
            disabled={!branchFilter}
          />
          <Button
            icon={<ReloadOutlined />}
            type="primary"
            onClick={handleResetFilters}
          >
            Reset Filter
          </Button>
        </div>

        <div className="w-full md:w-auto">
          <Input
            placeholder="Cari produk..."
            prefix={<SearchOutlined />}
            className="w-full md:w-64"
            allowClear
            onChange={handleSearchChange}
            value={params.search}
          />
        </div>
      </div>

      <ProductTable
        data={productRes?.data}
        meta={productRes?.meta}
        loading={isLoading}
        onPageChange={handlePageChange}
        onEdit={(record) => {
          setSelectedProduct(record);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteProduct}
      />

      <div className="mt-4 flex flex-wrap justify-end items-center gap-2">
        <Pagination
          current={productRes?.meta?.current_page ?? 1}
          pageSize={productRes?.meta?.page_size ?? 10}
          total={productRes?.meta?.total ?? 0}
          showSizeChanger={false}
          size="small"
          showTotal={(total) => `Total ${total} produk`}
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

      <ProductModal
        open={isModalOpen}
        initialValues={selectedProduct}
        branches={branches?.data}
        loading={creating || updating}
        isOwner={true}
        onCancel={() => setIsModalOpen(false)}
        onFinish={handleSubmit}
      />
    </div>
  );
}
