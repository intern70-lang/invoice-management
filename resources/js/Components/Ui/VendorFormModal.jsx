import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Modal, Form, Input, Divider, Row, Col } from "antd";
import { Truck } from "lucide-react";

const initialValues = {
    name: "",
    company: "",
    phone: "",
    email: "",
    tax_reg_number: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
};

export default function VendorFormModal({
    open,
    onClose,
    vendor = null,
    onSuccess = null,
}) {
    const isEdit = !!vendor;
    const [antForm] = Form.useForm();

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm(initialValues);

    useEffect(() => {
        if (open) {
            const values = {
                name: vendor?.name ?? "",
                company: vendor?.company ?? "",
                phone: vendor?.phone ?? "",
                email: vendor?.email ?? "",
                tax_reg_number: vendor?.tax_reg_number ?? "",
                address_line_1: vendor?.address_line_1 ?? "",
                address_line_2: vendor?.address_line_2 ?? "",
                city: vendor?.city ?? "",
                pincode: vendor?.pincode ?? "",
                state: vendor?.state ?? "",
                country: vendor?.country ?? "",
            };
            setData(values);
            antForm.setFieldsValue(values);
            clearErrors();
        } else {
            reset();
            antForm.resetFields();
            clearErrors();
        }
    }, [open, vendor]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            antForm.setFields(
                Object.entries(errors).map(([name, msg]) => ({
                    name,
                    errors: [msg],
                })),
            );
        }
    }, [errors]);

    const handleValuesChange = (changed) => {
        Object.entries(changed).forEach(([key, value]) => setData(key, value));
    };

    const handleSubmit = async () => {
        try {
            await antForm.validateFields();
        } catch {
            return;
        }

        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess?.();
                onClose();
            },
        };

        if (isEdit) {
            put(`/admin/vendors/${vendor.id}`, opts);
        } else {
            post("/admin/vendors", opts);
        }
    };

    const handleCancel = () => {
        if (!processing) onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            onOk={handleSubmit}
            okText={isEdit ? "Update Vendor" : "Save Vendor"}
            cancelText="Cancel"
            confirmLoading={processing}
            title={
                <div className="flex items-center gap-2">
                    <Truck size={18} className="text-(--primary)" />
                    <span>{isEdit ? "Edit Vendor" : "Add Vendor"}</span>
                </div>
            }
            width={760}
            destroyOnClose
            maskClosable={!processing}
        >
            <Divider className="my-3!" />

            <Form
                form={antForm}
                layout="vertical"
                onValuesChange={handleValuesChange}
                // requiredMark="optional"
                size="middle"
                variant="filled"
            >
                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Vendor Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vendor name is required",
                                },
                                {
                                    pattern: /^[a-zA-Z0-9\s\-]+$/,
                                    message:
                                        "Letters, numbers, spaces and hyphens only",
                                },
                                {
                                    min: 2,
                                    message:
                                        "Name must be at least 2 characters",
                                },
                                {
                                    max: 100,
                                    message:
                                        "Name cannot exceed 100 characters",
                                },
                            ]}
                        >
                            <Input
                                placeholder="e.g. Supply Partner"
                                autoComplete="off"
                                size="large"
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(
                                        /[^a-zA-Z0-9\s\-]/g,
                                        "",
                                    );
                                    if (sanitized !== e.target.value) {
                                        antForm.setFieldValue(
                                            "name",
                                            sanitized,
                                        );
                                        setData("name", sanitized);
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Company" name="company">
                            <Input placeholder="Company name" size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    pattern: /^[\d\s\+\-\(\)]+$/,
                                    message:
                                        "Digits, spaces, +, - and parentheses only",
                                },
                            ]}
                        >
                            <Input placeholder="Phone number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: "email",
                                    message: "Enter a valid email address",
                                },
                            ]}
                        >
                            <Input placeholder="name@example.com" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Tax Registration Number"
                    name="tax_reg_number"
                    rules={[
                        {
                            pattern: /^[a-zA-Z0-9\-\s]+$/,
                            message:
                                "Letters, numbers, spaces and hyphens only",
                        },
                    ]}
                >
                    <Input placeholder="Tax registration number" />
                </Form.Item>

                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Address Line 1" name="address_line_1">
                            <Input placeholder="Street address" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Address Line 2" name="address_line_2">
                            <Input placeholder="Apartment, suite, building" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={8}>
                        <Form.Item label="City" name="city">
                            <Input placeholder="City" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Zip code" name="pincode">
                            <Input placeholder="Zip code" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="State" name="state">
                            <Input placeholder="State" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Country" name="country">
                    <Input placeholder="Country" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
