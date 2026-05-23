"use client";

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
import { useGetAllBranches } from "@/hooks/queries/useBranch";
import { useNotification } from "@/hooks/useMessage";

const { Title } = Typography;

export default function OwnerCreateSalePage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const notification = useNotification();

  // --- QUERIES & MUTATIONS ---
  const { data: branchRes } = useGetAllBranches();
  // Tarik semua produk aktif untuk dipilih di form
  const { data: productRes, isLoading: loadingProducts } = useGetProducts({
    page: 1,
    pageSize: 100,
  });
  const { mutate: createSale, isPending: submitting } = useCreateSale();

  // --- HANDLER SUBMIT ---
  const onFinish = (values: any) => {
    // Bersihkan payload dan pastikan qty berupa number murni
    const payload = {
      branchId: values.branchId,
      notes: values.notes || undefined,
      items: values.items.map((item: any) => ({
        productId: item.productId,
        qty: Number(item.qty),
      })),
    };

    createSale(payload, {
      onSuccess: () => {
        notification.success({
          message: "Transaksi penjualan berhasil dicatat",
        });
        router.push("/owner/sales"); // Redirect kembali ke riwayat penjualan
      },
    });
  };

  return (
    <div className="md:px-6 mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} />
        <Title level={3} style={{ margin: 0 }}>
          Input Transaksi Baru
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* --- KARTU INFORMASI UTAMA --- */}
        <Card>
          <Form.Item
            name="branchId"
            label="Cabang Transaksi"
            rules={[
              {
                required: true,
                message: "Pilih cabang tempat transaksi terjadi",
              },
            ]}
          >
            <Select
              placeholder="Pilih Cabang Tujuan"
              size="large"
              showSearch
              optionFilterProp="children"
            >
              {branchRes?.data?.map((b) => (
                <Select.Option key={b.id} value={b.id}>
                  {b.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Catatan Penjualan (Opsional)">
            <Input.TextArea
              rows={2}
              placeholder="Masukkan deskripsi atau catatan tambahan transaksi..."
              size="large"
            />
          </Form.Item>
        </Card>

        {/* --- KARTU DAFTAR ITEM --- */}
        <Card title="Daftar Barang Belanja">
          <Form.List
            name="items"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(
                      new Error("Minimal harus ada 1 item yang terjual"),
                    );
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
                    className="flex flex-col md:flex-row md:items-start gap-4 mb-4"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "productId"]}
                      rules={[{ required: true, message: "Pilih produk" }]}
                      label="Produk"
                      className="flex-1 mb-0"
                    >
                      <Select
                        placeholder="Cari & Pilih Produk"
                        size="large"
                        loading={loadingProducts}
                        showSearch
                        optionFilterProp="children"
                      >
                        {productRes?.data?.map((p) => (
                          <Select.Option key={p.id} value={p.id}>
                            {p.name} ({p.unit})
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "qty"]}
                      rules={[{ required: true, message: "Wajib" }]}
                      label="Jumlah (Qty)"
                      className="w-full md:w-32 mb-0"
                    >
                      <InputNumber
                        min={1}
                        placeholder="0"
                        size="large"
                        controls={false}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>

                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                      className="md:mt-8 self-end md:self-auto"
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
                    Tambah Item Belanja
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
