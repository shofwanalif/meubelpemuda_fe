"use client";

import { DatePicker, Card, Button, Form, Row, Col, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface DashboardFiltersProps {
  onFilterChange: (values: any) => void;
  onReset: () => void;
}

export function DashboardFilters({
  onFilterChange,
  onReset,
}: DashboardFiltersProps) {
  const [form] = Form.useForm();

  const handleResetInternal = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(_, allValues) => {
          const formattedValues = {
            ...allValues,
            startDate: allValues.range?.[0]?.format("YYYY-MM-DD"),
            endDate: allValues.range?.[1]?.format("YYYY-MM-DD"),
          };
          onFilterChange(formattedValues);
        }}
      >
        <Row gutter={[24, 16]}>
          {/* Rentang Tanggal */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="range"
              label={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Rentang Tanggal
                </Text>
              }
            >
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* Tombol Reset — sejajar dengan input field */}
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Form.Item style={{ marginBottom: 0, width: "50%" }}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleResetInternal}
                block
              >
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
