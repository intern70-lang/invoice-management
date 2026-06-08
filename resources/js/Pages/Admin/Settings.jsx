// resources/js/Pages/Admin/Settings.jsx
import { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { useTheme } from "@/context/ThemeContext";

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
    Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Moon, Sun, Palette, Building2, Landmark } from "lucide-react";

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
    const { syncFromSettings, previewTheme } = useTheme();
    const [form] = Form.useForm();

    // ── Inertia form ─────────────────────────────────────────────────────────
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
        primary_color: settings?.primary_color || "#467CD5",
        secondary_color: settings?.secondary_color || "#14b8a6",
        currency_code: settings?.currency_code || "GBP",
        currency_symbol: settings?.currency_symbol || "£",
        logo: null,
    });

    // ── Logo upload state ────────────────────────────────────────────────────
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
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    // ── Sync AntD form from Inertia data on mount ────────────────────────────
    useEffect(() => {
        form.setFieldsValue(data);
    }, []);

    // ── Map server errors → AntD field errors ────────────────────────────────
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

    // ── Handle form field changes ─────────────────────────────────────────────
    const handleValuesChange = (changed) => {
        Object.entries(changed).forEach(([key, value]) => setData(key, value));
    };

    // ── Live color / theme preview (instant DOM update, no save) ─────────────
    const handlePrimaryColorChange = (color) => {
        const hex = color.toHexString();
        setData("primary_color", hex);
        form.setFieldValue("primary_color", hex);
        previewTheme({ primaryColor: hex });
    };

    const handleSecondaryColorChange = (color) => {
        const hex = color.toHexString();
        setData("secondary_color", hex);
        form.setFieldValue("secondary_color", hex);
        previewTheme({ secondaryColor: hex });
    };

    const handleThemeModeChange = (checked) => {
        const mode = checked ? "dark" : "light";
        setData("theme_mode", mode);
        form.setFieldValue("theme_mode", mode);
        previewTheme({ mode });
    };

    // ── Currency change (keeps symbol in sync) ───────────────────────────────
    const handleCurrencyChange = (value) => {
        const currency = currencies.find((c) => c.value === value);
        setData("currency_code", currency.value);
        setData("currency_symbol", currency.symbol);
    };

    // ── Logo upload helpers ───────────────────────────────────────────────────
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleLogoChange = ({ fileList: newList }) => {
        setFileList(newList);
        const file = newList[0]?.originFileObj;
        setData("logo", file ?? null);
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const submit = async () => {
        try {
            await form.validateFields();
        } catch {
            return;
        }

        post("/admin/settings", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                // Server responded — apply the saved settings to the whole app
                syncFromSettings(page.props.settings);
            },
        });
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <AppLayout>
            <Head title="System Settings" />

            <div className="max-w-4xl mx-auto space-y-5">
                {/* Page header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-(--primary) flex items-center justify-center">
                        <Palette size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-(--text-primary) m-0!">
                            System Settings
                        </h2>
                        <p className="text-xs text-(--text-secondary) mt-0.5 m-0!">
                            Application, appearance and invoice configuration
                        </p>
                    </div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleValuesChange}
                    requiredMark="optional"
                    variant="filled"
                >
                    {/* ── Application Info ── */}
                    <Card
                        className="mb-5! bg-(--bg-secondary)!"
                        title={
                            <div className="flex items-center gap-2">
                                <Building2
                                    size={16}
                                    className="text-(--primary)"
                                />
                                <span>Application Information</span>
                            </div>
                        }
                    >
                        <Row gutter={[16, 0]}>
                            <Col xs={24} md={12}>
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
                                            message: "At least 2 characters",
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            type: "email",
                                            message: "Enter a valid email",
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
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

                            <Col xs={24} md={12}>
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
                                        onChange={handleCurrencyChange}
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
                                            message: "Max 500 characters",
                                        },
                                    ]}
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* ── Appearance ── */}
                    <Card
                        className="mb-5! bg-(--bg-secondary)!"
                        title={
                            <div className="flex items-center gap-2">
                                <Palette
                                    size={16}
                                    className="text-(--primary)"
                                />
                                <span>Appearance</span>
                            </div>
                        }
                    >
                        <Row gutter={[16, 16]}>
                            {/* Logo */}
                            <Col xs={24} sm={24} md={6}>
                                <Form.Item
                                    label="Company Logo"
                                    className="m-0!"
                                >
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={handlePreview}
                                        onChange={handleLogoChange}
                                        beforeUpload={() => false}
                                        maxCount={1}
                                        accept="image/*"
                                    >
                                        {fileList.length >= 1 ? null : (
                                            <div>
                                                <PlusOutlined />
                                                <div className="mt-2 text-xs">
                                                    Upload
                                                </div>
                                            </div>
                                        )}
                                    </Upload>

                                    {previewImage && (
                                        <Image
                                            style={{ display: "none" }}
                                            preview={{
                                                open: previewOpen,
                                                onOpenChange: (v) =>
                                                    setPreviewOpen(v),
                                                afterOpenChange: (v) => {
                                                    if (!v) setPreviewImage("");
                                                },
                                            }}
                                            src={previewImage}
                                        />
                                    )}
                                </Form.Item>
                            </Col>

                            {/* Colors + theme mode */}
                            <Col xs={24} sm={24} md={18}>
                                <Row gutter={[16, 16]}>
                                    {/* Primary color */}
                                    <Col xs={24} sm={12}>
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
                                            <div className="flex items-center gap-2">
                                                <Tooltip title="Pick primary color">
                                                    <ColorPicker
                                                        value={
                                                            data.primary_color
                                                        }
                                                        onChange={
                                                            handlePrimaryColorChange
                                                        }
                                                        size="large"
                                                    />
                                                </Tooltip>
                                                <Input
                                                    value={data.primary_color}
                                                    size="large"
                                                    onChange={(e) => {
                                                        setData(
                                                            "primary_color",
                                                            e.target.value,
                                                        );
                                                        form.setFieldValue(
                                                            "primary_color",
                                                            e.target.value,
                                                        );
                                                        if (
                                                            /^#([A-Fa-f0-9]{6})$/.test(
                                                                e.target.value,
                                                            )
                                                        ) {
                                                            previewTheme({
                                                                primaryColor:
                                                                    e.target
                                                                        .value,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </Form.Item>
                                    </Col>

                                    {/* Secondary color */}
                                    <Col xs={24} sm={12}>
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
                                            <div className="flex items-center gap-2">
                                                <Tooltip title="Pick secondary color">
                                                    <ColorPicker
                                                        value={
                                                            data.secondary_color
                                                        }
                                                        onChange={
                                                            handleSecondaryColorChange
                                                        }
                                                        size="large"
                                                    />
                                                </Tooltip>
                                                <Input
                                                    value={data.secondary_color}
                                                    size="large"
                                                    onChange={(e) => {
                                                        setData(
                                                            "secondary_color",
                                                            e.target.value,
                                                        );
                                                        form.setFieldValue(
                                                            "secondary_color",
                                                            e.target.value,
                                                        );
                                                        if (
                                                            /^#([A-Fa-f0-9]{6})$/.test(
                                                                e.target.value,
                                                            )
                                                        ) {
                                                            previewTheme({
                                                                secondaryColor:
                                                                    e.target
                                                                        .value,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </Form.Item>
                                    </Col>

                                    {/* Theme mode toggle */}
                                    <Col span={24}>
                                        <div className="flex items-center justify-between border border-(--border-color) py-3 px-4 rounded-lg">
                                            <div>
                                                <p className="font-medium text-(--text-primary) m-0!">
                                                    Theme Mode
                                                </p>
                                                <p className="text-xs text-(--text-secondary) mt-0.5 m-0!">
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
                                                        className="mt-0.5"
                                                    />
                                                }
                                                unCheckedChildren={
                                                    <Sun size={14} />
                                                }
                                                onChange={handleThemeModeChange}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>

                    {/* ── Bank Details ── */}
                    <Card
                        className="mb-5! bg-(--bg-secondary)!"
                        title={
                            <div className="flex items-center gap-2">
                                <Landmark
                                    size={16}
                                    className="text-(--primary)"
                                />
                                <span>Bank Details</span>
                            </div>
                        }
                    >
                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Bank Name"
                                    name="bank_name"
                                    rules={[
                                        {
                                            max: 255,
                                            message: "Max 255 characters",
                                        },
                                    ]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
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

                            <Col xs={24} md={12}>
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
