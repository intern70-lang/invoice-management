// resources/js/Components/Ui/CustomerFormModal.jsx
// Reusable modal for Add / Edit customer.
// Used on: Customers page & Invoice page (quick-add).
//
// Props:
//  open        – boolean  – controls modal visibility
//  onClose     – fn       – called when modal should close
//  customer    – object|null – if provided → edit mode; null → add mode
//  onSuccess   – fn(customer) – called after a successful submission
//                               (for invoice page to receive the new record)
//  mode        – "page" | "quick"
//                "page"  → uses Inertia router (full page reload after save)
//                "quick" → fires a JSON fetch (for invoice modal quick-add)

import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Divider,
    Row,
    Col,
    Typography,
} from "antd";
import { UserPlus, UserCheck } from "lucide-react";

const { Text } = Typography;
const { TextArea } = Input;

export default function CustomerFormModal({
    open,
    onClose,
    customer = null,
    onSuccess = null,
    mode = "page",
}) {
    const isEdit = !!customer;
    const [antForm] = Form.useForm();

    // ── Inertia useForm ──────────────────────────────────────────────────────
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            email: "",
            phone: "",
            customer_type: "regular",
            vat_registered: false,
            vat_number: "",
            address: "",
        });

    // Sync form fields when modal opens or customer changes
    useEffect(() => {
        if (open) {
            const values = {
                name: customer?.name ?? "",
                email: customer?.email ?? "",
                phone: customer?.phone ?? "",
                customer_type: customer?.customer_type ?? "regular",
                vat_registered: customer?.vat_registered ? true : false,
                vat_number: customer?.vat_number ?? "",
                address: customer?.address ?? "",
            };
            // Sync Inertia data
            Object.entries(values).forEach(([k, v]) => setData(k, v));
            // Sync Ant Design Form UI
            antForm.setFieldsValue(values);
            clearErrors();
        } else {
            reset();
            antForm.resetFields();
            clearErrors();
        }
    }, [open, customer]);

    // Map Inertia server errors → Ant Design field errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const fieldErrors = Object.entries(errors).map(([name, msg]) => ({
                name,
                errors: [msg],
            }));
            antForm.setFields(fieldErrors);
        }
    }, [errors]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleValuesChange = (changed) => {
        Object.entries(changed).forEach(([k, v]) => setData(k, v));
    };

    const handleSubmit = async () => {
        // 1. Run Ant Design client-side validation first
        try {
            await antForm.validateFields();
        } catch {
            return; // Ant Design will show field errors
        }

        if (mode === "quick") {
            // JSON fetch for invoice page
            try {
                const res = await fetch("/admin/customers/quick", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content"),
                    },
                    body: JSON.stringify(data),
                });
                const json = await res.json();
                if (!res.ok) {
                    if (json.errors) {
                        const fieldErrors = Object.entries(json.errors).map(
                            ([name, msgs]) => ({
                                name,
                                errors: Array.isArray(msgs) ? msgs : [msgs],
                            }),
                        );
                        antForm.setFields(fieldErrors);
                    }
                    return;
                }
                onSuccess?.(json);
                onClose();
            } catch (err) {
                console.error("Quick store error:", err);
            }
            return;
        }

        // 2. Inertia full-page submission
        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess?.();
                onClose();
            },
        };

        if (isEdit) {
            put(`/admin/customers/${customer.id}`, opts);
        } else {
            post("/admin/customers", opts);
        }
    };

    const handleCancel = () => {
        if (!processing) onClose();
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            onOk={handleSubmit}
            okText={isEdit ? "Update Customer" : "Save Customer"}
            cancelText="Cancel"
            confirmLoading={processing}
            title={
                <div className="flex items-center gap-2">
                    {isEdit ? (
                        <UserCheck size={18} className="text-(--primary)" />
                    ) : (
                        <UserPlus size={18} className="text-(--primary)" />
                    )}
                    <span>{isEdit ? "Edit Customer" : "Add Customer"}</span>
                </div>
            }
            width={580}
            destroyOnClose
            maskClosable={!processing}
        >
            <Divider className="my-3!" />

            <Form
                form={antForm}
                layout="vertical"
                onValuesChange={handleValuesChange}
                requiredMark="optional"
                size="middle"
                variant="filled"
            >
                {/* Name */}
                <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                        { required: true, message: "Full name is required" },
                        {
                            pattern: /^[a-zA-Z\s'-]+$/,
                            message: "Name can only contain letters",
                        },
                        {
                            min: 2,
                            message: "Name must be at least 2 characters",
                        },
                    ]}
                >
                    <Input
                        placeholder="e.g. John Smith"
                        autoComplete="off"
                        size="large"
                    />
                </Form.Item>

                <Row gutter={16}>
                    {/* Email */}
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Email is required",
                                },
                                {
                                    type: "email",
                                    message: "Enter a valid email address",
                                },
                            ]}
                        >
                            <Input
                                placeholder="john@example.com"
                                autoComplete="off"
                                size="large"
                            />
                        </Form.Item>
                    </Col>

                    {/* Phone */}
                    <Col span={12}>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    pattern: /^[+\d\s\-()]{7,15}$/,
                                    message: "Enter a valid phone number",
                                },
                            ]}
                        >
                            <Input
                                placeholder="+44 7700 000000"
                                autoComplete="off"
                                maxLength={15}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Customer Type */}
                    <Col span={12}>
                        <Form.Item
                            label="Customer Type"
                            name="customer_type"
                            rules={[
                                { required: true, message: "Type is required" },
                            ]}
                        >
                            <Select size="large">
                                <Select.Option value="regular">
                                    Regular
                                </Select.Option>
                                <Select.Option value="business">
                                    Business
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* VAT Registered */}
                    <Col span={12}>
                        <Form.Item
                            label="VAT Registered"
                            name="vat_registered"
                            valuePropName="checked"
                        >
                            <Switch
                                size="large"
                                checkedChildren="Yes"
                                unCheckedChildren="No"
                                onChange={(val) =>
                                    setData("vat_registered", val)
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* VAT Number – conditionally shown */}
                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                        prev.vat_registered !== curr.vat_registered
                    }
                >
                    {({ getFieldValue }) =>
                        getFieldValue("vat_registered") ? (
                            <Form.Item
                                label="VAT Number"
                                name="vat_number"
                                rules={[
                                    {
                                        required: true,
                                        message: "VAT number is required",
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9]+$/,
                                        message:
                                            "VAT number must be alphanumeric",
                                    },
                                    { max: 17, message: "Max 17 characters" },
                                ]}
                            >
                                <Input
                                    placeholder="GB123456789"
                                    autoComplete="off"
                                    maxLength={17}
                                    size="large"
                                />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>

                {/* Address */}
                <Form.Item label="Address" name="address">
                    <TextArea
                        rows={2}
                        placeholder="Street, City, Postcode"
                        className="resize-none"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
