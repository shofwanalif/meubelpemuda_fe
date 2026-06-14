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
  Tag,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: sale, isLoading } = useGetSaleDetail(params.id as string);

  const formatRp = (val: string | number | null | undefined) => {
    if (val === null || val === undefined || val === "") return "Rp 0";
    const num = typeof val === "string" ? Number(val) : val;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const columns = [
    {
      title: "Produk",
      dataIndex: ["product", "name"],
      key: "productName",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "center" as const,
    },
    {
      title: "Harga Satuan",
      dataIndex: "sellPriceSnapshot",
      key: "price",
      align: "right" as const,
      render: (val: string) => formatRp(val),
    },
    {
      title: "Potongan",
      dataIndex: "discountAmount",
      key: "discount",
      align: "right" as const,
      render: (val: string) => formatRp(val),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      align: "right" as const,
      render: (_: unknown, record: any) => {
        const subtotal = record.totalSell
          ? Number(record.totalSell)
          : Number(record.qty) * Number(record.sellPriceSnapshot);
        return <Text strong>{formatRp(subtotal)}</Text>;
      },
    },
    {
      title: "Laba Kotor",
      dataIndex: "grossProfit",
      key: "profit",
      align: "right" as const,
      render: (val: string) => <Text>{formatRp(val)}</Text>,
    },
  ];

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!sale) {
    return <div className="p-10 text-center">Data tidak ditemukan</div>;
  }

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

      {/* Informasi Penjualan */}
      <Card className="mb-6" variant="borderless">
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
          <Descriptions.Item label="Total Penjualan">
            {formatRp(sale.totalSell)}
          </Descriptions.Item>
          <Descriptions.Item label="Total Laba Kotor">
            {formatRp(sale.totalGrossProfit)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag
              color={
                sale.status.toLowerCase() === "completed" ? "green" : "red"
              }
            >
              {sale.status.toLowerCase() === "completed"
                ? "SELESAI"
                : "DIBATALKAN"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Informasi Pelanggan */}
      <Card className="mb-6" variant="borderless">
        <Descriptions
          title="Informasi Pelanggan"
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Nama Pelanggan">
            {sale.customer.name}
          </Descriptions.Item>
          <Descriptions.Item label="Alamat">
            {sale.customer.address}
          </Descriptions.Item>
          <Descriptions.Item label="Telepon">
            {sale.customer.phone}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Daftar Produk */}
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
                <Table.Summary.Row></Table.Summary.Row>
              </Table.Summary>
            );
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
