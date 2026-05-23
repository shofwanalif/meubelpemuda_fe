"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSaleDetail } from "@/hooks/queries/useSale";
import {
  Table,
  Button,
  Card,
  Descriptions,
  Typography,
  Spin,
  Space,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: saleRes, isLoading } = useGetSaleDetail(params.id as string);
  const sale = saleRes?.data;

  const formatRp = (val: string | number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val));

  const columns = [
    {
      title: "Produk",
      dataIndex: ["product", "name"],
      key: "productName",
      render: (text: string, record: any) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Unit: {record.product.unit}
          </Text>
        </div>
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "center" as const,
      render: (qty: string) => <Text>{qty}</Text>,
    },
    {
      title: "Harga Satuan",
      dataIndex: "sellPriceSnapshot",
      key: "price",
      align: "right" as const,
      render: (val: string) => formatRp(val),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      align: "right" as const,
      render: (_: unknown, record: any) => {
        // Super Teliti: Handle totalSell null dari API
        const subtotal = record.totalSell
          ? Number(record.totalSell)
          : Number(record.qty) * Number(record.sellPriceSnapshot);
        return <Text strong>{formatRp(subtotal)}</Text>;
      },
    },
    {
      title: "Laba (Gross)",
      dataIndex: "grossProfit",
      key: "profit",
      align: "right" as const,
      render: (val: string) => <Text>{formatRp(val)}</Text>,
    },
  ];

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spin size="large" />
      </div>
    );
  if (!sale)
    return <div className="p-10 text-center">Data tidak ditemukan</div>;

  return (
    <div className="md:px-6">
      <div className="mb-6 flex justify-between items-center">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            Kembali
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            Detail Transaksi
          </Title>
        </Space>
      </div>

      <Card className="mb-6">
        <Descriptions
          title="Informasi Penjualan"
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Tanggal">
            {dayjs(sale.saleDate).format("DD MMMM YYYY HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Cabang">
            {sale.branch.name}
          </Descriptions.Item>
          <Descriptions.Item label="Kasir">
            {sale.createdBy.name}
          </Descriptions.Item>
          <Descriptions.Item label="Catatan">
            {sale.notes || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Daftar Produk Terjual" variant="borderless">
        <Table
          columns={columns}
          dataSource={sale.items}
          pagination={false}
          rowKey="id"
          summary={(pageData) => {
            let totalProfit = 0;
            pageData.forEach(({ grossProfit }) => {
              totalProfit += Number(grossProfit);
            });
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4} align="right">
                    <Text strong>Total Laba Kotor:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Text strong>{formatRp(totalProfit)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
          scroll={{ x: 1500 }}
        />
      </Card>
    </div>
  );
}
