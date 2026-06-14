"use client";

import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { Category } from "@/services/category.service";

interface CategoryModalProps {
  open: boolean;
  initialValues: Category | null;
  loading: boolean;
  onCancel: () => void;
  onFinish: (values: { name: string; branchId?: string }) => void;
}

export function CategoryModal({
  open,
  initialValues,
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
          <Input placeholder="Contoh: perabotan" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
