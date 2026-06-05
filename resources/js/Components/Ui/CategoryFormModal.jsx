// resources/js/Components/Ui/CategoryFormModal.jsx
// Reusable modal for Add / Edit category.
// Used on: Categories page.
//
// Props:
//  open        – boolean        – controls modal visibility
//  onClose     – fn             – called when modal should close
//  category    – object|null    – if provided → edit mode; null → add mode
//  onSuccess   – fn()           – called after a successful submission

import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Modal, Form, Input, Divider, Typography } from "antd";
import { Tag, TagIcon } from "lucide-react";

const { Text } = Typography;

export default function CategoryFormModal({
    open,
    onClose,
    category = null,
    onSuccess = null,
}) {
    const isEdit = !!category;
    const [antForm] = Form.useForm();

    // ── Inertia useForm ──────────────────────────────────────────────────────
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
        });

    // Sync form fields when modal opens or category changes
    useEffect(() => {
        if (open) {
            const values = {
                name: category?.name ?? "",
            };
            setData("name", values.name);
            antForm.setFieldsValue(values);
            clearErrors();
        } else {
            reset();
            antForm.resetFields();
            clearErrors();
        }
    }, [open, category]);

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
            put(`/admin/categories/${category.id}`, opts);
        } else {
            post("/admin/categories", opts);
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
            okText={isEdit ? "Update Category" : "Save Category"}
            cancelText="Cancel"
            confirmLoading={processing}
            title={
                <div className="flex items-center gap-2">
                    <TagIcon size={18} className="text-(--primary)" />
                    <span>{isEdit ? "Edit Category" : "Add Category"}</span>
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
                {/* Name */}
                <Form.Item
                    label="Category Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Category name is required",
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
                            max: 50,
                            message: "Name cannot exceed 50 characters",
                        },
                    ]}
                >
                    <Input
                        placeholder="e.g. Electronics"
                        autoComplete="off"
                        size="large"
                        onChange={(e) => {
                            // Strip disallowed characters on the fly (mirrors old Blade JS)
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
