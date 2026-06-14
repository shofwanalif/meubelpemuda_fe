"use client";

import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { Category } from "@/services/category.service";
import { Branches } from "@/services/branch.service";

interface CategoryModalProps {
  open: boolean;
  initialValues: Category | null;
  branches?: Branches[];
  loading: boolean;
  onCancel: () => void;
  onFinish: (values: { name: string; branchId?: string }) => void;
}

export function CategoryModal({
  open,
  initialValues,
  branches,
  loading,
  onCancel,
  onFinish,
}: CategoryModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          branchId: initialValues.branch?.id,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={initialValues ? "Edit Kategori" : "Tambah Kategori Baru"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
      centered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Nama Kategori"
          rules={[{ required: true, message: "Nama kategori wajib diisi" }]}
        >
          <Input placeholder="Contoh: Kayu Jati" size="large" />
        </Form.Item>

        <Form.Item
          name="branchId"
          label="Cabang"
          rules={[{ required: true, message: "Pilih cabang" }]}
        >
          <Select
            placeholder="Pilih cabang"
            options={branches?.map((b) => ({ label: b.name, value: b.id }))}
            disabled={!!initialValues}
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
