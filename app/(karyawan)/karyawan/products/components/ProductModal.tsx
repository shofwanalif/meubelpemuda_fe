"use client";

import { Modal, Form, Input, InputNumber, Select, Divider } from "antd";
import { useEffect, useState } from "react";
import { Product } from "@/services/product.service";
import { Branches } from "@/services/branch.service";
import { useGetCategories } from "@/hooks/queries/useCategories";

interface ProductModalProps {
  open: boolean;
  initialValues: Product | null;
  branches?: Branches[];
  isOwner: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  loading: boolean;
}

export function ProductModal({
  open,
  initialValues,
  branches,
  isOwner,
  onCancel,
  onFinish,
  loading,
}: ProductModalProps) {
  const [form] = Form.useForm();
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(
    undefined,
  );

  // Ambil kategori berdasarkan cabang yang dipilih (owner) atau semua (karyawan)
  const { data: categoriesRes } = useGetCategories(
    {
      page: 1,
      limit: 999,
      branchId: isOwner ? selectedBranchId : undefined,
    },
    { enabled: isOwner ? !!selectedBranchId : true },
  );

  const categoryOptions =
    categoriesRes?.data?.map((c) => ({
      label: c.name,
      value: c.id,
    })) ?? [];

  useEffect(() => {
    if (open) {
      if (initialValues) {
        const branchId = initialValues.branch?.id;
        setSelectedBranchId(branchId);
        form.setFieldsValue({
          name: initialValues.name ?? undefined,
          description: initialValues.description ?? undefined,
          categoryId: initialValues.category?.id ?? undefined,
          costPrice:
            Number(initialValues.activePrice?.costPrice || 0) || undefined,
          sellPrice:
            Number(initialValues.activePrice?.sellPrice || 0) || undefined,
          stock: initialValues.stock ?? undefined,
          branchId: initialValues.branch?.id ?? undefined,
        });
      } else {
        form.resetFields();
        setSelectedBranchId(undefined);
      }
    }
  }, [open, initialValues, form]);

  const handleBranchChange = (value: string | undefined) => {
    setSelectedBranchId(value);
    form.setFieldValue("categoryId", undefined);
  };

  return (
    <Modal
      title={initialValues ? "Edit Produk" : "Tambah Produk Baru"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={600}
      destroyOnHidden
      centered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Nama Produk"
          rules={[{ required: true, message: "Nama produk wajib diisi" }]}
        >
          <Input placeholder="Contoh: Meja Kayu Jati" size="large" />
        </Form.Item>

        <Form.Item name="description" label="Deskripsi">
          <Input.TextArea
            rows={3}
            placeholder="Detail spesifikasi produk..."
            size="large"
          />
        </Form.Item>

        {isOwner && (
          <Form.Item
            name="branchId"
            label="Cabang"
            rules={[{ required: true, message: "Pilih cabang" }]}
          >
            <Select
              placeholder="Pilih cabang"
              options={branches?.map((b) => ({ label: b.name, value: b.id }))}
              onChange={handleBranchChange}
              allowClear
              size="large"
            />
          </Form.Item>
        )}

        <Form.Item
          name="categoryId"
          label="Kategori"
          rules={[{ required: true, message: "Pilih kategori" }]}
        >
          <Select
            placeholder={
              isOwner && !selectedBranchId
                ? "Pilih cabang terlebih dahulu"
                : "Pilih kategori"
            }
            options={categoryOptions}
            disabled={isOwner && !selectedBranchId}
            size="large"
          />
        </Form.Item>

        <Divider orientation="horizontal">Harga & Stok</Divider>

        <Form.Item
          name="costPrice"
          label="Harga Modal (HPP)"
          rules={[{ required: true, message: "Wajib" }]}
          className="flex-1"
        >
          <InputNumber
            placeholder="0"
            formatter={(value) =>
              `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/Rp\s?|(,*)/g, "")}
            controls={false}
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="sellPrice"
          label="Harga Jual"
          rules={[{ required: true, message: "Wajib" }]}
        >
          <InputNumber
            placeholder="0"
            formatter={(value) =>
              `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/Rp\s?|(,*)/g, "")}
            controls={false}
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stok"
          rules={[
            { required: !isOwner, message: "Stok awal wajib diisi" },
            { type: "number", min: 0, message: "Stok tidak boleh negatif" },
          ]}
        >
          <InputNumber
            placeholder="Jumlah stok"
            size="large"
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
