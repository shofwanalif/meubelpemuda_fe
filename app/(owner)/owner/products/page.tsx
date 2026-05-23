"use client";

import { useState } from "react";
import { Typography, Button, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

// Hooks & Services
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useDeactivateProduct,
  useActivateProduct,
} from "@/hooks/queries/useProduct";
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
  const [params, setParams] = useState({ page: 1, pageSize: 10, search: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- SEARCH LOGIC ---
  const debouncedSearch = useDebounce(params.search, 500);

  // --- QUERIES ---
  const { data: productRes, isLoading } = useGetProducts({
    ...params,
    search: debouncedSearch,
  });
  const { data: branches } = useGetAllBranches();

  // --- MUTATIONS ---
  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: deactivateProduct } = useDeactivateProduct();
  const { mutate: activateProduct } = useActivateProduct(); // Gunakan hook ini

  // --- HANDLERS ---
  const handlePageChange = (page: number, pageSize: number) => {
    setParams((prev) => ({ ...prev, page, pageSize }));
  };

  const handleSubmit = (values: any) => {
    const options = {
      onSuccess: () => {
        notification.success({
          message: selectedProduct ? "Produk diperbarui" : "Produk ditambahkan",
        });
        setIsModalOpen(false);
      },
    };

    if (selectedProduct) {
      updateProduct({ id: selectedProduct.id, data: values }, options);
    } else {
      createProduct(values, options);
    }
  };

  const handleStatusChange = (
    id: string,
    action: "activate" | "deactivate",
  ) => {
    const mutation =
      action === "activate" ? activateProduct : deactivateProduct;

    mutation(id, {
      onSuccess: () => {
        notification.success({
          title: `Produk berhasil ${action === "activate" ? "diaktifkan" : "dinonaktifkan"}`,
        });
      },
    });
  };

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

      <div className="flex justify-end mb-6">
        <Input
          placeholder="Cari produk..."
          prefix={<SearchOutlined />}
          className="max-w-xs"
          allowClear
          onChange={(e) =>
            setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }))
          }
        />
      </div>

      <ProductTable
        data={productRes?.data}
        meta={productRes?.meta}
        loading={isLoading}
        // role="owner"
        onPageChange={handlePageChange}
        onEdit={(record) => {
          setSelectedProduct(record);
          setIsModalOpen(true);
        }}
        onDelete={(id) => deleteProduct(id)}
        onDeactivate={(id) => deactivateProduct(id)}
        onActivate={(id) => handleStatusChange(id, "activate")}
      />

      <ProductModal
        open={isModalOpen}
        initialValues={selectedProduct}
        branches={branches?.data}
        loading={creating || updating}
        onCancel={() => setIsModalOpen(false)}
        onFinish={handleSubmit}
      />
    </div>
  );
}
