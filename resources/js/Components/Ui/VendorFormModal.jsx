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
            destroyOnHidden
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
                                    pattern: /^[A-Za-z\s.,]+$/,
                                    message:
                                        "Name can only contain letters, spaces, dots (.) and commas (,)",
                                },
                                {
                                    min: 2,
                                    message: "Name must be at least 2 characters",
                                },
                                {
                                    max: 100,
                                    message: "Name cannot exceed 100 characters",
                                },
                            ]}
                        >
                            <Input
                                placeholder="e.g. Supply Partner"
                                autoComplete="off"
                                size="large"
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(/[^A-Za-z\s.,]/g, "");
                                    antForm.setFieldValue("name", sanitized);
                                    setData("name", sanitized);
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Company" name="company"
                            rules={[
                                {
                                    required: true,
                                    message: "Company name is required",
                                },
                                {
                                    min: 2,
                                    message: "Company name must be at least 2 characters",
                                },
                                {
                                    max: 150,
                                    message: "Company name cannot exceed 150 characters",
                                },
                            ]}
                        >
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
                                    pattern: /^(?:\+92|92|0)?3\d{9}$/,
                                    message:
                                        "Enter a valid mobile number (03XXXXXXXXX)",
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
                                    required: true,
                                    message: "Email is required",
                                },
                                {
                                    type: "email",
                                    message: "Enter a valid email address",
                                },
                                {
                                    max: 255,
                                    message: "Email cannot exceed 255 characters",
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
                            min: 3,
                            message: "Tax registration number is too short",
                        },
                        {
                            max: 50,
                            message: "Tax registration number cannot exceed 50 characters",
                        },
                        {
                            pattern: /^[A-Za-z0-9\s-]+$/,
                            message:
                                "Only letters, numbers, spaces and hyphens are allowed",
                        },
                    ]}
                >
                    <Input placeholder="Tax registration number" />
                </Form.Item>

                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Address Line 1" name="address_line_1"
                            rules={[
                                {
                                    max: 255,
                                    message: "Address cannot exceed 255 characters",
                                },
                            ]}
                        >
                            <Input placeholder="Street address" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Address Line 2" name="address_line_2"
                            rules={[
                                {
                                    max: 255,
                                    message: "Address cannot exceed 255 characters",
                                },
                            ]}
                        >
                            <Input placeholder="Apartment, suite, building" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={8}>
                        <Form.Item label="City" name="city"
                            rules={[
                                {
                                    pattern: /^[A-Za-z\s.,]+$/,
                                    message:
                                        "City can only contain letters, spaces, dots and commas",
                                },
                                {
                                    max: 100,
                                    message: "City cannot exceed 100 characters",
                                },
                            ]}
                        >
                            <Input placeholder="City" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Pin / Zip code"
                            name="pincode"
                            rules={[
                                {
                                    pattern: /^\d{5}$/,
                                    message: "Zip code must be exactly 5 digits",
                                },
                            ]}
                        >
                            <Input placeholder="Zip code" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="State" name="state"
                            rules={[
                                {
                                    pattern: /^[A-Za-z\s.,]+$/,
                                    message:
                                        "State can only contain letters, spaces, dots and commas",
                                },
                                {
                                    max: 100,
                                    message: "State cannot exceed 100 characters",
                                },
                            ]}
                        >
                            <Input placeholder="State" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Country" name="country"
                    rules={[
                        {
                            pattern: /^[A-Za-z\s.,]+$/,
                            message:
                                "Country can only contain letters, spaces, dots and commas",
                        },
                        {
                            max: 100,
                            message: "Country cannot exceed 100 characters",
                        },
                    ]}
                >
                    <Input placeholder="Country" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
