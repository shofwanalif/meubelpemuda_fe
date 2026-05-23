"use client";

import { Modal, Form, Input, InputNumber, Divider } from "antd";
import { useEffect } from "react";
import { Product } from "@/services/product.service";

interface ProductModalProps {
  open: boolean;
  initialValues: Product | null;
  onCancel: () => void;
  onFinish: (values: any) => void;
  loading: boolean;
}

export function ProductModal({
  open,
  initialValues,
  onCancel,
  onFinish,
  loading,
}: ProductModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        // SUPER TELITI: Mapping data dari objek 'price' tunggal milik karyawan
        form.setFieldsValue({
          name: initialValues.name,
          unit: initialValues.unit,
          description: initialValues.description,
          // Ambil dari price object (sesuai response API karyawan)
          costPrice: initialValues.price
            ? Number(initialValues.price.costPrice)
            : undefined,
          sellPrice: initialValues.price
            ? Number(initialValues.price.sellPrice)
            : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

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
        <Form.Item
          name="unit"
          label="Unit"
          rules={[{ required: true, message: "Wajib" }]}
        >
          <Input placeholder="Pcs/Set" size="large" />
        </Form.Item>

        <Form.Item name="description" label="Deskripsi">
          <Input.TextArea
            rows={3}
            placeholder="Detail spesifikasi produk..."
            size="large"
          />
        </Form.Item>

        <Divider orientation="horizontal">Informasi Harga</Divider>

        <Form.Item
          name="costPrice"
          label="Harga Modal (HPP)"
          rules={[{ required: true, message: "Wajib diisi" }]}
        >
          <InputNumber
            placeholder="Rp 0"
            style={{ width: "100%" }}
            formatter={(value) =>
              `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/Rp\s?|(,*)/g, "")}
            controls={false}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="sellPrice"
          label="Harga Jual"
          rules={[{ required: true, message: "Wajib diisi" }]}
        >
          <InputNumber
            placeholder="Rp 0"
            style={{ width: "100%" }}
            formatter={(value) =>
              `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/Rp\s?|(,*)/g, "")}
            controls={false}
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
