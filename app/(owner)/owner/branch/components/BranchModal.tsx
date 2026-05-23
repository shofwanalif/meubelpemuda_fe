"use client";

import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { CreateBranch, Branches } from "@/services/branch.service";

interface BranchModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: CreateBranch) => void;
  loading: boolean;
  initialValues?: Branches | null; // Jika ada, berarti mode Edit
}

export function BranchModal({
  open,
  onCancel,
  onFinish,
  loading,
  initialValues,
}: BranchModalProps) {
  const [form] = Form.useForm();

  // Reset form saat initialValues berubah (untuk mode edit) atau saat modal ditutup
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={initialValues ? "Edit Cabang" : "Tambah Cabang Baru"}
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
          label="Nama Cabang"
          rules={[{ required: true, message: "Nama wajib diisi" }]}
        >
          <Input placeholder="Contoh: Pemuda Baamang 2" size="large" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Alamat"
          rules={[{ required: true, message: "Alamat wajib diisi" }]}
        >
          <Input.TextArea placeholder="Jl. Muchran Ali No 23" size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
