"use client";

import { Form, Input, Button, Typography, Space } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { useRegisterMutation } from "@/hooks/queries/useAuth";
import { useNotification } from "@/hooks/useMessage";

const { Title, Text } = Typography;

type registerValues = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const [form] = Form.useForm();

  const { mutate: register } = useRegisterMutation();

  const notification = useNotification();

  const onFinish = (values: registerValues) => {
    console.log("Register values:", values);

    register(values, {
      onSuccess: () => {
        notification.success({
          title: "Registrasi berhasil!",
          description: "Silahkan login dengan akun yang baru dibuat",
        });
      },
      onError: (error) => {
        notification.error({
          title: "Registrasi Gagal",
          description: error.message || "Terjadi kesalahan, silahkan coba lagi",
          placement: "topRight",
        });
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
        <Title level={2} className="mb-2 font-bold">
          Buat Akun Baru
        </Title>
        <Text type="secondary">Start your journey with us today</Text>
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
          name="name"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            prefix={<UserOutlined className="mr-2" />}
            placeholder="Nama lengkap"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Invalid email format!" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="mr-2" />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Password must be at least 8 characters!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="mr-2" />}
            placeholder="Password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="h-12 font-semibold"
          >
            Daftar
          </Button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="text-center mt-6">
        <Text type="secondary">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium hover:underline"
            style={{ color: "#2563EB" }}
          >
            Login
          </Link>
        </Text>
      </div>
    </AuthLayout>
  );
}
