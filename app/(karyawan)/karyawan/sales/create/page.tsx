"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Divider,
  Typography,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useCreateSale } from "@/hooks/queries/useSale";
import { useGetProducts } from "@/hooks/queries/useProduct";
import { useNotification } from "@/hooks/useMessage";

const { Title } = Typography;

export default function KaryawanCreateSalePage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const notification = useNotification();

  // Karyawan tidak perlu mengirim branchId, API akan mengambil cabang dari session
  const { data: productRes, isLoading: loadingProducts } = useGetProducts({
    page: 1,
    limit: 999,
  });

  const { mutate: createSale, isPending: submitting } = useCreateSale();

  const onFinish = (values: any) => {
    const items = values.items.map((item: any) => {
      const itemPayload: any = {
        productId: item.productId,
        qty: Number(item.qty),
      };
      if (item.discountAmount && Number(item.discountAmount) > 0) {
        itemPayload.discountAmount = Number(item.discountAmount);
      }
      return itemPayload;
    });

    // Karyawan tidak mengirim branchId
    const payload: any = {
      customerName: values.customerName,
      customerPhone: values.customerPhone || undefined,
      customerAddress: values.customerAddress || undefined,
      items,
    };
    if (values.notes) payload.notes = values.notes;

    createSale(payload, {
      onSuccess: () => {
        notification.success({
          title: "Transaksi penjualan berhasil dicatat",
        });
        router.push("/karyawan/sales");
      },
      onError: (error: any) => {
        notification.error({
          title:
            error.response?.data?.message ||
            "Gagal mencatat transaksi penjualan",
        });
      },
    });
  };

  const productMap = new Map(productRes?.data?.map((p) => [p.id, p]) || []);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const numberParser = (value: string | undefined) => {
    if (!value) return 0;
    const cleaned = value.replace(/Rp\s?|(,*)/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  };

  return (
    <div className="md:px-6 mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} />
        <Title level={3} style={{ margin: 0 }}>
          Input Transaksi Baru (Karyawan)
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* INFORMASI PELANGGAN */}
        <Card title="Informasi Pelanggan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="customerName"
              label="Nama Pelanggan"
              rules={[{ required: true, message: "Wajib" }]}
            >
              <Input placeholder="Contoh: Siti Rahayu" size="large" />
            </Form.Item>
            <Form.Item name="customerPhone" label="Telepon (opsional)">
              <Input placeholder="08123456789" size="large" />
            </Form.Item>
          </div>
          <Form.Item name="customerAddress" label="Alamat (opsional)">
            <Input.TextArea
              rows={2}
              placeholder="Jl. Ahmad Yani No. 5"
              size="large"
            />
          </Form.Item>
          <Form.Item name="notes" label="Catatan (Opsional)">
            <Input.TextArea
              rows={2}
              placeholder="Catatan tambahan..."
              size="large"
            />
          </Form.Item>
        </Card>

        {/* DAFTAR PRODUK */}
        <Card title="Daftar Barang" className="mt-4">
          <Form.List
            name="items"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(new Error("Minimal 1 item"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    className="flex flex-col md:flex-row md:items-start gap-4 p-3"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "productId"]}
                      label="Produk"
                      rules={[{ required: true, message: "Pilih produk" }]}
                      className="flex-1 mb-0"
                    >
                      <Select
                        placeholder="Cari produk"
                        loading={loadingProducts}
                        showSearch
                        size="large"
                        optionFilterProp="children"
                      >
                        {productRes?.data?.map((p) => (
                          <Select.Option key={p.id} value={p.id}>
                            {p.name} (Stok: {p.stock})
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, curr) =>
                        prev.items?.[name]?.productId !==
                        curr.items?.[name]?.productId
                      }
                    >
                      {({ getFieldValue }) => {
                        const productId = getFieldValue([
                          "items",
                          name,
                          "productId",
                        ]);
                        const product = productId
                          ? productMap.get(productId)
                          : null;
                        if (!product) return null;
                        const sellPrice = Number(product.activePrice.sellPrice);
                        const costPrice = Number(product.activePrice.costPrice);
                        return (
                          <div className="flex flex-col gap-1 text-sm p-6 rounded">
                            <span>
                              Harga Jual:{" "}
                              <strong>{formatRupiah(sellPrice)}</strong>
                            </span>
                            <span>Harga Modal: {formatRupiah(costPrice)}</span>
                          </div>
                        );
                      }}
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "qty"]}
                      label="Qty"
                      rules={[{ required: true, message: "Wajib" }]}
                      className="w-full md:w-24 mb-0"
                    >
                      <InputNumber
                        min={1}
                        placeholder="0"
                        size="large"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "discountAmount"]}
                      label="Potongan"
                      className="w-full md:w-32 mb-0"
                    >
                      <InputNumber
                        min={0}
                        placeholder="0"
                        size="large"
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={numberParser}
                      />
                    </Form.Item>

                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                      className="md:mt-8 self-end"
                    />
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    size="large"
                  >
                    Tambah Item
                  </Button>
                  <Form.ErrorList
                    errors={errors}
                    className="text-red-500 mt-2"
                  />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          <Form.Item className="mb-0 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={submitting}
            >
              Simpan Transaksi
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
}
