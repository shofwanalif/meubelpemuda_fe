"use client";

import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Tooltip,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  Product,
  PaginationMeta,
  ProductPriceOwner,
} from "@/services/product.service";
import { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface ProductTableProps {
  data: Product[] | undefined;
  loading: boolean;
  meta?: PaginationMeta;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (record: Product) => void;
  onDelete: (id: string) => void;
  onDeactivate: (id: string) => void;
  onActivate: (id: string) => void; // Prop baru
}

// --- 1. Sub-Komponen untuk Baris Detail (Expanded Row) ---
const ExpandedPriceTable = ({ prices }: { prices: ProductPriceOwner[] }) => {
  // Hanya ambil harga yang memiliki branchId (harga cabang spesifik)
  const branchPrices = prices.filter((p) => p.branchId !== null);

  const formatRp = (val: string | number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val));

  const columns = [
    {
      title: "Nama Cabang",
      dataIndex: ["branch", "name"],
      key: "branch",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Harga Modal",
      dataIndex: "costPrice",
      key: "costPrice",
      render: (val: string) => formatRp(val),
    },
    {
      title: "Harga Jual",
      dataIndex: "sellPrice",
      key: "sellPrice",
      render: (val: string) => <Text>{formatRp(val)}</Text>,
    },
    {
      title: "Update Terakhir",
      dataIndex: "effectiveFrom",
      key: "effectiveFrom",
      render: (val: string) => new Date(val).toLocaleDateString("id-ID"),
    },
  ];

  return (
    <div className="">
      <div className="mb-4 flex items-center gap-2">
        <InfoCircleOutlined />
        <Text strong italic>
          Rincian Harga per Cabang
        </Text>
      </div>
      <Table
        columns={columns}
        dataSource={branchPrices}
        pagination={false}
        size="small"
        rowKey="id"
        bordered
      />
    </div>
  );
};

// --- 2. Komponen Utama Tabel Produk ---
export function ProductTable({
  data,
  loading,
  meta,
  onPageChange,
  onEdit,
  onDelete,
  onDeactivate,
  onActivate,
}: ProductTableProps) {
  const formatRp = (val: string | number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val));

  const columns: ColumnsType<Product> = [
    // --- GROUP: IDENTITAS ---
    {
      title: "Informasi Produk",
      //   fixed: "left",
      children: [
        {
          title: "Nama",
          dataIndex: "name",
          key: "name",
          width: 200,
          render: (text) => <Text strong>{text}</Text>,
        },
        {
          title: "Unit",
          dataIndex: "unit",
          key: "unit",
          width: 100,
          align: "center",
        },
      ],
    },
    // --- GROUP: HARGA GLOBAL ---
    {
      title: "Harga Pusat (Global)",
      align: "center",
      children: [
        {
          title: "Harga Modal",
          key: "costPrice",
          width: 150,
          render: (_, record) => {
            const global = record.prices?.find((p) => p.branchId === null);
            return global ? (
              formatRp(global.costPrice)
            ) : (
              <Text type="secondary">-</Text>
            );
          },
        },
        {
          title: "Harga Jual",
          key: "sellPrice",
          width: 150,
          render: (_, record) => {
            const global = record.prices?.find((p) => p.branchId === null);
            return global ? (
              <Text>{formatRp(global.sellPrice)}</Text>
            ) : (
              <Text type="secondary">-</Text>
            );
          },
        },
      ],
    },
    // --- STATUS & AKSI ---
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      width: 120,
      align: "center",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Aktif" : "Non-Aktif"}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 130,
      align: "center",
      //   fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Ubah Data">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          {record.isActive ? (
            <Tooltip title="Non-aktifkan">
              <Popconfirm
                title="Matikan produk ini?"
                onConfirm={() => onDeactivate(record.id)}
                okText="Ya"
                cancelText="Tidak"
              >
                <Button type="primary" danger icon={<StopOutlined />} />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Aktifkan Kembali">
              <Popconfirm
                title="Aktifkan produk ini?"
                onConfirm={() => onActivate(record.id)}
                okText="Ya"
                cancelText="Tidak"
              >
                <Button type="primary" icon={<CheckCircleOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}

          <Popconfirm
            title="Hapus permanen?"
            onConfirm={() => onDelete(record.id)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      bordered
      scroll={{ x: 1100 }}
      // --- LOGIKA EXPANDABLE ---
      expandable={{
        expandedRowRender: (record) => (
          <ExpandedPriceTable prices={record.prices || []} />
        ),
        // Baris hanya bisa di-expand jika produk punya harga cabang (branchId != null)
        rowExpandable: (record) =>
          record.prices?.some((p) => p.branchId !== null) || false,

        expandRowByClick: false, // User harus klik ikon [+] agar tidak bentrok dengan aksi lain
      }}
      pagination={{
        current: meta?.current_page,
        pageSize: meta?.page_size,
        total: meta?.total,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
        onChange: onPageChange,
        showTotal: (total) => `Total ${total} produk`,
      }}
    />
  );
}
