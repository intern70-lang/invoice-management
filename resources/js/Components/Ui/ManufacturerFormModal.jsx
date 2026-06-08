import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Modal, Form, Input, Divider, Row, Col } from "antd";
import { Factory } from "lucide-react";

const initialValues = {
    name: "",
    number: "",
    email: "",
    address: "",
};

export default function ManufacturerFormModal({
    open,
    onClose,
    manufacturer = null,
    onSuccess = null,
}) {
    const isEdit = !!manufacturer;
    const [antForm] = Form.useForm();

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm(initialValues);

    useEffect(() => {
        if (open) {
            const values = {
                name: manufacturer?.name ?? "",
                number: manufacturer?.number ?? "",
                email: manufacturer?.email ?? "",
                address: manufacturer?.address ?? "",
            };
            setData(values);
            antForm.setFieldsValue(values);
            clearErrors();
        } else {
            reset();
            antForm.resetFields();
            clearErrors();
        }
    }, [open, manufacturer]);

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
            put(`/admin/manufacturers/${manufacturer.id}`, opts);
        } else {
            post("/admin/manufacturers", opts);
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
            okText={isEdit ? "Update Manufacturer" : "Save Manufacturer"}
            cancelText="Cancel"
            confirmLoading={processing}
            title={
                <div className="flex items-center gap-2">
                    <Factory size={18} className="text-(--primary)" />
                    <span>
                        {isEdit ? "Edit Manufacturer" : "Add Manufacturer"}
                    </span>
                </div>
            }
            width={620}
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
                <Form.Item
                    label="Manufacturer Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Manufacturer name is required",
                        },
                        {
                            pattern: /^[a-zA-Z0-9\s\-]+$/,
                            message:
                                "Letters, numbers, spaces and hyphens only",
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
                        placeholder="e.g. Acme Foods"
                        autoComplete="off"
                        size="large"
                        onChange={(e) => {
                            const sanitized = e.target.value.replace(
                                /[^a-zA-Z0-9\s\-]/g,
                                "",
                            );
                            if (sanitized !== e.target.value) {
                                antForm.setFieldValue("name", sanitized);
                                setData("name", sanitized);
                            }
                        }}
                    />
                </Form.Item>

                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Number"
                            name="number"
                            maxLength={15}
                            rules={[
                                {
                                    pattern: /^[\d\s\+\-\(\)]+$/,
                                    message:
                                        "Digits, spaces, +, - and parentheses only",
                                },
                                {
                                    min: 10,
                                    message: "Number must be at least 10 characters",
                                },
                                {
                                    max: 15,
                                    message: "Number cannot exceed 15 characters",
                                },
                            ]}
                        >
                            <Input placeholder="Phone or contact number" />
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

                <Form.Item label="Address" name="address">
                    <Input.TextArea
                        rows={3}
                        maxLength={500}
                        showCount
                        placeholder="Manufacturer address"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
