"use client";
import { Card, Col, Row, Skeleton } from "antd";
import {
  ShoppingCartOutlined,
  WalletOutlined,
  StockOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { SalesSummaryData } from "@/services/sale.service";

interface StatsCardsProps {
  data?: SalesSummaryData;
  loading: boolean;
}

export function StatsCards({ data, loading }: StatsCardsProps) {
  const formatIDR = (val: string | number = 0) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val));

  const items = [
    {
      title: "Transaksi Sukses",
      value: data?.totalTransaksi,
      icon: <ShoppingCartOutlined />,
      color: "#1677ff",
      suffix: " Transaksi",
    },
    {
      title: "Transaksi Dibatalkan",
      value: data?.totalTransaksiCancelled,
      icon: <StopOutlined />,
      color: "#f5222d",
      suffix: " Transaksi",
    },
    {
      title: "Pendapatan (Revenue)",
      value: formatIDR(data?.totalRevenue),
      icon: <WalletOutlined />,
      color: "#52c41a",
    },
    {
      title: "Laba Kotor (Profit)",
      value: formatIDR(data?.totalGrossProfit),
      icon: <StockOutlined />,
      color: "#722ed1",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item, idx) => (
        <Col xs={24} sm={12} lg={6} key={idx}>
          <Card className="overflow-hidden">
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Kiri: title + value */}
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#8c8c8c",
                      marginBottom: 8,
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>
                    {item.value}
                    {item.suffix && (
                      <span style={{ fontSize: 16, marginLeft: 4 }}>
                        {item.suffix}
                      </span>
                    )}
                  </div>
                </div>

                {/* Kanan: icon */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: `${item.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    color: item.color,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
              </div>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
}
