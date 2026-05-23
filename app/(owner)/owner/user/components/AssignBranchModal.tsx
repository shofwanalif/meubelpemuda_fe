"use client";

import { Modal, Form, Select, Typography } from "antd";
import { Employee } from "@/services/user.service";
import { Branches } from "@/services/branch.service";

interface AssignBranchModalProps {
  open: boolean;
  user: Employee | null;
  branches?: Branches[];
  onCancel: () => void;
  onFinish: (values: { userId: string; branchId: string }) => void;
  loading: boolean;
}

export function AssignBranchModal({
  open,
  user,
  branches,
  onCancel,
  onFinish,
  loading,
}: AssignBranchModalProps) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Assign ke Cabang"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
      centered
    >
      {user && (
        <div className="mb-4">
          <Typography.Text type="secondary">Karyawan: </Typography.Text>
          <Typography.Text strong>{user.name}</Typography.Text>
        </div>
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={(v) => onFinish({ userId: user?.id!, ...v })}
      >
        <Form.Item
          name="branchId"
          label="Pilih Cabang Baru"
          rules={[{ required: true }]}
        >
          <Select placeholder="Pilih Cabang" size="large">
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
