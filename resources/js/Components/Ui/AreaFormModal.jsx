import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Modal, Form, Input, Divider, Typography } from "antd";
import { MapPin } from "lucide-react";

const { Text } = Typography;

export default function AreaFormModal({
    open,
    onClose,
    area = null,
    onSuccess = null,
}) {
    const isEdit = !!area;
    const [antForm] = Form.useForm();

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
        });

    useEffect(() => {
        if (open) {
            const values = {
                name: area?.name ?? "",
            };
            setData("name", values.name);
            antForm.setFieldsValue(values);
            clearErrors();
        } else {
            reset();
            antForm.resetFields();
            clearErrors();
        }
    }, [open, area]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const fieldErrors = Object.entries(errors).map(([name, msg]) => ({
                name,
                errors: [msg],
            }));
            antForm.setFields(fieldErrors);
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
            put(`/admin/areas/${area.id}`, opts);
        } else {
            post("/admin/areas", opts);
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
            okText={isEdit ? "Update Area" : "Save Area"}
            cancelText="Cancel"
            confirmLoading={processing}
            title={
                <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-(--primary)" />
                    <span>{isEdit ? "Edit Area" : "Add Area"}</span>
                </div>
            }
            width={420}
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
                    label="Area Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Area name is required",
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
                        placeholder="e.g. Downtown"
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

                <Text type="secondary" className="text-xs">
                    Letters, numbers, spaces and hyphens only.
                </Text>
            </Form>
        </Modal>
    );
}
