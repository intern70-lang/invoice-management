import React, { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

import {
    Card,
    Row,
    Col,
    Input,
    Button,
    Select,
    Upload,
    Image,
    Typography,
    Divider,
    Switch,
    ColorPicker,
    Form,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { Moon, Sun } from "lucide-react";

const { Title, Text } = Typography;
const { TextArea } = Input;

const currencies = [
    { label: "GBP (£)", value: "GBP", symbol: "£" },
    { label: "USD ($)", value: "USD", symbol: "$" },
    { label: "EUR (€)", value: "EUR", symbol: "€" },
    { label: "PKR (₨)", value: "PKR", symbol: "₨" },
    { label: "AED (د.إ)", value: "AED", symbol: "د.إ" },
];

export default function Settings({ settings }) {
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",

        app_name: settings?.app_name || "",
        address: settings?.address || "",
        phone: settings?.phone || "",
        email: settings?.email || "",

        bank_name: settings?.bank_name || "",
        iban: settings?.iban || "",
        swift_code: settings?.swift_code || "",

        theme_mode: settings?.theme_mode || "dark",

        primary_color: settings?.primary_color || "#1677ff",

        secondary_color: settings?.secondary_color || "#13c2c2",

        currency_code: settings?.currency_code || "GBP",
        currency_symbol: settings?.currency_symbol || "£",

        logo: null,
    });

    useEffect(() => {
        form.setFieldsValue(data);
    }, []);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            form.setFields(
                Object.entries(errors).map(([name, msg]) => ({
                    name,
                    errors: [msg],
                })),
            );
        }
    }, [errors]);

    const handleValuesChange = (changed) => {
        Object.entries(changed).forEach(([key, value]) => {
            setData(key, value);
        });
    };

    const [fileList, setFileList] = useState(
        settings?.logo
            ? [
                  {
                      uid: "-1",
                      name: "logo",
                      status: "done",
                      url: `/storage/${settings.logo}`,
                  },
              ]
            : [],
    );

    const submit = async () => {
        try {
            await form.validateFields();
        } catch {
            return;
        }

        post("/admin/settings", {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);

        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        if (newFileList.length > 0) {
            const file = newFileList[0]?.originFileObj;

            if (file) {
                setData("logo", file);
            }
        } else {
            setData("logo", null);
        }
    };

    const uploadButton = (
        <button
            type="button"
            style={{
                border: 0,
                background: "none",
            }}
        >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <AppLayout>
            <Head title="System Settings" />

            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <Title level={3} style={{ marginBottom: 0 }}>
                        System Settings
                    </Title>

                    <Text type="secondary">
                        Configure application, appearance and invoice settings.
                    </Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleValuesChange}
                    requiredMark={true}
                    variant="filled"
                >
                    {/* Application Info */}
                    <Card className="mb-5!">
                        <Title level={5}>Application Information</Title>

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Form.Item
                                    label="App Name"
                                    name="app_name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Application name is required",
                                        },
                                        {
                                            min: 2,
                                            message:
                                                "App name must be at least 2 characters",
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            type: "email",
                                            message:
                                                "Enter a valid email address",
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Phone"
                                    name="phone"
                                    rules={[
                                        {
                                            pattern: /^[0-9+\-\s()]+$/,
                                            message:
                                                "Enter a valid phone number",
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Currency"
                                    name="currency_code"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Currency is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        options={currencies}
                                        onChange={(value) => {
                                            const currency = currencies.find(
                                                (c) => c.value === value,
                                            );

                                            setData(
                                                "currency_code",
                                                currency.value,
                                            );
                                            setData(
                                                "currency_symbol",
                                                currency.symbol,
                                            );
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Address"
                                    name="address"
                                    rules={[
                                        {
                                            max: 500,
                                            message:
                                                "Address cannot exceed 500 characters",
                                        },
                                    ]}
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Divider />
                                <Title level={5}>Appearance Settings</Title>
                            </Col>

                            <Col xs={24} sm={24} md={8} lg={6}>
                                <label className="block mb-2 font-medium">
                                    Company Logo
                                </label>

                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    beforeUpload={() => false}
                                    maxCount={1}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>

                                {previewImage && (
                                    <Image
                                        style={{ display: "none" }}
                                        preview={{
                                            open: previewOpen,
                                            onOpenChange: (visible) =>
                                                setPreviewOpen(visible),
                                            afterOpenChange: (visible) => {
                                                if (!visible) {
                                                    setPreviewImage("");
                                                }
                                            },
                                        }}
                                        src={previewImage}
                                    />
                                )}
                            </Col>

                            <Col xs={24} sm={24} md={16} lg={18}>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <div className="flex items-center gap-3">
                                            <ColorPicker
                                                value={data.primary_color}
                                                onChange={(color) =>
                                                    setData(
                                                        "primary_color",
                                                        color.toHexString(),
                                                    )
                                                }
                                            />

                                            <Form.Item
                                                label="Primary Color"
                                                name="primary_color"
                                                rules={[
                                                    {
                                                        pattern:
                                                            /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                                                        message:
                                                            "Enter a valid HEX color",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    value={data.primary_color}
                                                    onChange={(e) =>
                                                        setData(
                                                            "primary_color",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="flex items-center gap-3">
                                            <ColorPicker
                                                value={data.secondary_color}
                                                onChange={(color) =>
                                                    setData(
                                                        "secondary_color",
                                                        color.toHexString(),
                                                    )
                                                }
                                            />

                                            <Form.Item
                                                label="Secondary Color"
                                                name="secondary_color"
                                                rules={[
                                                    {
                                                        pattern:
                                                            /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                                                        message:
                                                            "Enter a valid HEX color",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    value={data.secondary_color}
                                                    onChange={(e) =>
                                                        setData(
                                                            "secondary_color",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Form.Item>
                                        </div>
                                    </Col>

                                    <Col span={24}>
                                        <div className="flex items-center justify-between border border-(--border-color) py-2 px-4 rounded-lg">
                                            <div>
                                                <h4 className="font-medium mb-0.5!">
                                                    Theme Mode
                                                </h4>
                                                <p className="text-xs text-gray-500 mb-0.5!">
                                                    Choose between light and
                                                    dark appearance
                                                </p>
                                            </div>

                                            <Switch
                                                checked={
                                                    data.theme_mode === "dark"
                                                }
                                                checkedChildren={
                                                    <Moon
                                                        size={14}
                                                        className="mt-1"
                                                    />
                                                }
                                                unCheckedChildren={
                                                    <Sun size={14} />
                                                }
                                                onChange={(checked) =>
                                                    setData(
                                                        "theme_mode",
                                                        checked
                                                            ? "dark"
                                                            : "light",
                                                    )
                                                }
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>

                    {/* Bank Details */}
                    <Card className="mb-5!">
                        <Title level={5}>Bank Details</Title>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Bank Name"
                                    name="bank_name"
                                    rules={[
                                        {
                                            max: 255,
                                            message:
                                                "Bank name cannot exceed 255 characters",
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="IBAN"
                                    name="iban"
                                    rules={[
                                        {
                                            pattern: /^[A-Z0-9\s]*$/,
                                            message: "Enter a valid IBAN",
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="SWIFT / BIC"
                                    name="swift_code"
                                    rules={[
                                        {
                                            pattern: /^[A-Za-z0-9]*$/,
                                            message: "Enter a valid SWIFT code",
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="primary"
                            size="large"
                            loading={processing}
                            onClick={submit}
                        >
                            Save Settings
                        </Button>
                    </div>
                </Form>
            </div>
        </AppLayout>
    );
}
