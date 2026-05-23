"use client";

import { ReactNode } from "react";
import { Row, Col, theme, Image } from "antd";

export function AuthLayout({ children }: { children: ReactNode }) {
  const { token } = theme.useToken();

  return (
    <Row className="min-h-screen" align="stretch">
      <Col
        xs={24}
        md={12}
        lg={14}
        style={{
          backgroundColor: token.colorBgContainer,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 500 }}>{children}</div>
      </Col>

      <Col
        xs={0}
        md={12}
        lg={10}
        className="hidden md:flex items-center justify-center relative overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-center p-12 w-full h-full">
          <Image
            src="/Fingerprint-bro.svg"
            width={600}
            height={600}
            alt="Authentication Illustration"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-24 -right-24 w-500px h-500px rounded-full opacity-20 bg-red-500 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-400px h-400px rounded-full opacity-10 bg-red-500 blur-3xl" />
        </div>
      </Col>
    </Row>
  );
}
