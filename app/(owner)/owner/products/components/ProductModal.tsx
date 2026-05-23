"use client";

import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Button,
  Divider,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { Product } from "@/services/product.service";
import { Branches } from "@/services/branch.service";

interface ProductModalProps {
  open: boolean;
  initialValues: Product | null;
  branches?: Branches[];
  onCancel: () => void;
  onFinish: (values: any) => void;
  loading: boolean;
}

export function ProductModal({
  open,
  initialValues,
  branches,
  onCancel,
  onFinish,
  loading,
}: ProductModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        // Mapping data prices untuk form
        const mappedData = {
          ...initialValues,
          prices: initialValues.prices?.map((p) => ({
            branchId: p.branchId,
            costPrice: Number(p.costPrice),
            sellPrice: Number(p.sellPrice),
          })),
        };
        form.setFieldsValue(mappedData);
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
      width={800}
      destroyOnHidden
      centered
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Space className="w-full" align="start">
          <Form.Item
            name="name"
            label="Nama Produk"
            rules={[{ required: true }]}
            className="flex-1"
          >
            <Input placeholder="Contoh: Meja Kayu Jati" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true }]}
            style={{ width: 150 }}
          >
            <Input placeholder="Pcs/Set" />
          </Form.Item>
        </Space>

        <Form.Item name="description" label="Deskripsi">
          <Input.TextArea rows={3} placeholder="Detail spesifikasi produk..." />
        </Form.Item>

        <Divider orientation="horizontal">Manajemen Harga</Divider>

        <Form.List name="prices">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "branchId"]}
                    style={{ width: 250 }}
                  >
                    <Select placeholder="Semua Cabang (Global)" allowClear>
                      {branches?.map((b) => (
                        <Select.Option key={b.id} value={b.id}>
                          {b.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* <Form.Item
                    {...restField}
                    name={[name, "costPrice"]}
                    rules={[{ required: true, message: "Wajib" }]}
                  >
                    <InputNumber
                      placeholder="HPP (Cost)"
                      formatter={(v) =>
                        `Rp ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      style={{ width: 180 }}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "sellPrice"]}
                    rules={[{ required: true, message: "Wajib" }]}
                  >
                    <InputNumber
                      placeholder="Harga Jual"
                      formatter={(v) =>
                        `Rp ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      style={{ width: 180 }}
                    />
                  </Form.Item> */}

                  <Form.Item
                    {...restField}
                    name={[name, "costPrice"]}
                    rules={[{ required: true, message: "Wajib" }]}
                  >
                    <InputNumber
                      placeholder="HPP (Cost)"
                      style={{ width: 180 }}
                      // Formatter: Mengubah angka -> Teks berformat (Rp)
                      formatter={(value) =>
                        `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      // Parser: Mengubah Teks berformat -> Angka murni (PENTING!)
                      parser={(value) => value!.replace(/Rp\s?|(,*)/g, "")}
                      // Tambahan: Hilangkan tombol up/down agar tidak mengganggu input harga
                      controls={false}
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "sellPrice"]}
                    rules={[{ required: true, message: "Wajib" }]}
                  >
                    <InputNumber
                      placeholder="Harga Jual"
                      style={{ width: 180 }}
                      formatter={(value) =>
                        `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value!.replace(/Rp\s?|(,*)/g, "")}
                      controls={false}
                      className="w-full"
                    />
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    className="text-red-500"
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Tambah Harga
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
