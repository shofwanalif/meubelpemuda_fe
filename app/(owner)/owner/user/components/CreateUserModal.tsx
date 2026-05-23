"use client";

import { Modal, Form, Input, Select } from "antd";
import { CreateEmployee } from "@/services/user.service";
import { Branches } from "@/services/branch.service";

interface CreateUserModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: CreateEmployee) => void;
  loading: boolean;
  branches?: Branches[];
}

export function CreateUserModal({
  open,
  onCancel,
  onFinish,
  loading,
  branches,
}: CreateUserModalProps) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Tambah Karyawan Baru"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
      centered
    >
      <Form form={form} layout="vertical" onFinish={onFinish} preserve={false}>
        <Form.Item
          name="name"
          label="Nama Lengkap"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nama Karyawan" size="large" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="email@gmail.com" size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password placeholder="******" size="large" />
        </Form.Item>
        <Form.Item name="branchId" label="Penempatan Cabang (Opsional)">
          <Select placeholder="Pilih Cabang" allowClear size="large">
            {branches?.map((b) => (
              <Select.Option key={b.id} value={b.id}>
                {b.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
