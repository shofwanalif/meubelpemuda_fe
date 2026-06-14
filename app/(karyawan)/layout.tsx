"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "@/lib/auth-client";
import { useNotification } from "@/hooks/useMessage";
import { useUserSession } from "@/hooks/queries/useAuth";
import { useQueryClient } from "@tanstack/react-query";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import {
  IconLayoutDashboard,
  IconListDetails,
  IconReportMoney,
  IconCopyCheck,
} from "@tabler/icons-react";
import {
  Button,
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  theme,
  Drawer,
  Grid,
} from "antd";
import { useThemeMode } from "@/providers/AppTheme";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

// Ekstrak sebagai komponen terpisah
function SidebarContent({
  token,
  selectedKey,
  menuItems,
  onMenuClick,
  collapsed,
  mode,
}: {
  token: ReturnType<typeof theme.useToken>["token"];
  selectedKey: string;
  menuItems: any[];
  onMenuClick: (key: string) => void;
  collapsed: boolean;
  mode: "light" | "dark";
}) {
  return (
    <>
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Image
          src={mode === "dark" ? "/pemudadark.svg" : "/pemuda.svg"}
          alt="POS System"
          width={collapsed ? 32 : 150}
          height={32}
          priority
        />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => onMenuClick(key)}
        style={{
          borderRight: 0,
          marginTop: 16,
          background: token.colorBgContainer,
        }}
      />
    </>
  );
}

export default function KaryawanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const notification = useNotification();

  // user
  const { data: session } = useUserSession();

  const queryClient = useQueryClient();

  // logout
  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.clear();
          router.push("/login");
          notification.success({
            title: "Logout Berhasil",
            placement: "topRight",
          });
        },
        onError: (error) => {
          notification.error({
            title: "Logout gagal",
            description: error.error.message,
            placement: "topRight",
          });
        },
      },
    });
  };

  const { mode, toggle } = useThemeMode();
  const pathname = usePathname();
  const router = useRouter();
  const screens = useBreakpoint();

  const isMobile = !screens.lg;

  const { token } = theme.useToken();
  const {
    token: { colorBgContainer, borderRadiusLG, colorTextDescription },
  } = theme.useToken();

  const getSelectedKey = (path: string) => {
    if (path === "/karyawan") return "dashboard";
    if (path.startsWith("/karyawan/sales")) return "sales";
    if (path.startsWith("/karyawan/products")) return "products";
    if (path.startsWith("/karyawan/category")) return "category";
    return "dashboard";
  };

  const menuRoutes: Record<string, string> = {
    dashboard: "/karyawan",
    sales: "/karyawan/sales",
    products: "/karyawan/products",
    category: "/karyawan/category",
  };

  const selectedKey = getSelectedKey(pathname);

  const menuItems = [
    {
      key: "main",
      type: "group",
      label: "Menu Utama",
      children: [
        {
          key: "dashboard",
          icon: <IconLayoutDashboard />,
          label: "Dashboard",
        },
        {
          key: "sales",
          icon: <IconReportMoney />,
          label: "Penjualan",
        },
      ],
    },
    {
      key: "master",
      label: "Master Data",
      type: "group",
      children: [
        {
          key: "products",
          icon: <IconListDetails />,
          label: "Daftar Produk",
        },
        {
          key: "category",
          icon: <IconCopyCheck />,
          label: "Daftar Kategori",
        },
      ],
    },
  ];

  const userMenuItems = [
    {
      key: "logout",
      label: "Keluar",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const handleMenuClick = (key: string) => {
    if (menuRoutes[key]) {
      router.push(menuRoutes[key]);
    }
    if (isMobile) setDrawerOpen(false); // tutup drawer setelah navigasi
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setDrawerOpen(true); // mobile: buka drawer
    } else {
      setCollapsed(!collapsed); // desktop: collapse sider
    }
  };

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sider hanya tampil di desktop */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={260}
          style={{
            boxShadow: "1px 0 6px rgba(0,21,41,0.08)",
            background: token.colorBgContainer,
            zIndex: 10,
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            overflow: "hidden",
          }}
        >
          <SidebarContent
            token={token}
            selectedKey={selectedKey}
            menuItems={menuItems}
            onMenuClick={handleMenuClick}
            collapsed={collapsed}
            mode={mode}
          />
        </Sider>
      )}

      {/* Drawer hanya tampil di mobile */}
      {isMobile && (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          size={260}
          styles={{
            body: { padding: 0, background: token.colorBgContainer },
            header: { display: "none" },
          }}
        >
          <SidebarContent
            token={token}
            selectedKey={selectedKey}
            menuItems={menuItems}
            onMenuClick={handleMenuClick}
            collapsed={collapsed}
            mode={mode}
          />
        </Drawer>
      )}

      <Layout style={{ overflow: "hidden" }}>
        <Header
          style={{
            padding: "0 24px 0 0",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
            zIndex: 9,
            flexShrink: 0,
          }}
        >
          <Space size={0}>
            <Button
              type="text"
              icon={
                !isMobile && collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={handleToggleSidebar}
              style={{ width: 64, height: 64 }}
            />
            <Text strong className="hidden md:block">
              Karyawan Dashboard
            </Text>
          </Space>

          <Space size="middle" style={{ paddingRight: 16 }} align="center">
            <Button
              type="text"
              shape="circle"
              icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggle}
            />

            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space size="middle" style={{ cursor: "pointer" }} align="center">
                {session ? (
                  <div className="flex flex-col items-end">
                    <Text strong>{session.user.name}</Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: colorTextDescription,
                      }}
                    >
                      {" "}
                      {session.user.role}
                    </Text>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <Text strong>Owner Name</Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: colorTextDescription,
                      }}
                    >
                      role owner
                    </Text>
                  </div>
                )}
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#FA541C" }}
                />
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            padding: isMobile ? "12px" : "16px 24px",
            margin: isMobile ? "12px" : "24px",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflowY: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
