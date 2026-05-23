"use client";

import { Form, Input, Button, Typography, Space, Tag } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useNotification } from "@/hooks/useMessage";
import { useLoginMutation } from "@/hooks/queries/useAuth";

const { Title, Text } = Typography;

type loginValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [form] = Form.useForm();

  const notification = useNotification();

  const { mutate: login, isPending } = useLoginMutation();

  const onFinish = async (values: loginValues) => {
    // console.log("1. Fungsi onFinish dipicu dengan values:", values);

    login(values, {
      onSuccess: (data) => {
        // console.log("2. Mutasi Sukses! Data session:", data);
        // Cek apakah data.user.role ada sebelum redirect
      },
      onError: (error) => {
        console.error("2. Mutasi Gagal! Error detail:", error);
        notification.error({
          title: "Login Gagal",
          description: error.message || "Terjadi kesalahan, silahkan coba lagi",
          placement: "topRight",
        });
      },
      onSettled: () => {
        // console.log("3. Mutasi Selesai (berhasil/gagal)");
      },
    });
  };

  return (
    <AuthLayout>
      {/* Logo */}
      <Space className="mb-8" align="center">
        <Image src="/pemuda.svg" alt="Logo" width={160} height={32} />
      </Space>

      {/* Header */}
      <div className="mb-8">
        <Title level={2} className="mb-1 font-bold">
          Selamat Datang Kembali
        </Title>
        <Tag variant="filled" color="blue" icon={<InfoCircleOutlined />}>
          {" "}
          Silahkan masuk menggunakan email dan password anda
        </Tag>
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Invalid email format!" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="mr-2" />}
            placeholder="user@gmail.com"
            size="large"
            disabled={isPending}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
          className="mb-2"
        >
          <Input.Password
            prefix={<LockOutlined className="mr-2" />}
            placeholder="••••••••••••"
            size="large"
            disabled={isPending}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="h-12 font-semibold"
            loading={isPending}
          >
            Login
          </Button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="text-center mt-6">
        <Text type="secondary">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium hover:underline"
            style={{ color: "#2563EB" }}
          >
            Daftar
          </Link>
        </Text>
      </div>
    </AuthLayout>
  );
}
