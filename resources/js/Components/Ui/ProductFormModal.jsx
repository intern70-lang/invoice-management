// resources/js/Components/Ui/ProductFormModal.jsx
// Reusable modal for Add / Edit product.
//
// Props:
//  open       – boolean
//  onClose    – fn
//  product    – object|null  (null = add mode, object = edit mode)
//  categories – array of { id, name }

import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Divider,
    Row,
    Col,
    Typography,
    Alert,
} from "antd";
import { PackagePlus, PackageCheck } from "lucide-react";

const { Text } = Typography;
const { TextArea } = Input;

export default function ProductFormModal({
    open,
    onClose,
    product = null,
    categories = [],
}) {
    const isEdit = !!product;
    const [antForm] = Form.useForm();

    // ── Inertia useForm ──────────────────────────────────────────────────────
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: "",
            description: "",
            category_id: null,
            qty: "",
            moq: "",
            purchase_price: "",
            selling_price: "",
            vat: 0,
        });

    // Sync form when modal opens / product changes
    useEffect(() => {
        if (open) {
            const values = {
                name: product?.name ?? "",
                description: product?.description ?? "",
                category_id: product?.category_id ?? null,
                qty: product?.qty ?? "",
                moq: product?.moq ?? "",
                purchase_price: product?.purchase_price ?? "",
                selling_price: product?.selling_price ?? "",
                vat: product?.vat ?? 0,
            };
            Object.entries(values).forEach(([k, v]) => setData(k, v));
            antForm.setFieldsValue(values);
            clearErrors();
        } else {
            reset();
            antForm.resetFields();
            clearErrors();
        }
    }, [open, product]);

    // Map Laravel validation errors → Ant Design field errors
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
            onSuccess: () => onClose(),
        };

        if (isEdit) {
            put(`/admin/products/${product.id}`, opts);
        } else {
            post("/admin/products", opts);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Modal
            open={open}
            onCancel={() => !processing && onClose()}
            onOk={handleSubmit}
            okText={isEdit ? "Update Product" : "Save Product"}
            cancelText="Cancel"
            confirmLoading={processing}
            title={
                <div className="flex items-center gap-2">
                    {isEdit ? (
                        <div className="bg-gray-50/10 text-white rounded-md p-1 w-8 h-8 flex items-center justify-center">
                            <PackageCheck size={18} />
                        </div>
                    ) : (
                        <div className="bg-gray-50/10 text-white rounded-md p-1 w-8 h-8 flex items-center justify-center">
                            <PackagePlus size={18} />
                        </div>
                    )}
                    <span>{isEdit ? "Edit Product" : "Add Product"}</span>
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
                {/* Name */}
                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[
                        { required: true, message: "Product name is required" },
                        {
                            min: 2,
                            message: "Name must be at least 2 characters",
                        },
                    ]}
                >
                    <Input
                        placeholder="e.g. iPhone 15 Pro"
                        autoComplete="off"
                        size="large"
                    />
                </Form.Item>

                {/* Description */}
                <Form.Item label="Description" name="description">
                    <TextArea
                        rows={2}
                        placeholder="Optional product description"
                        className="resize-none"
                    />
                </Form.Item>

                {/* Category */}
                <Form.Item
                    label="Category"
                    name="category_id"
                    rules={[
                        { required: true, message: "Category is required" },
                    ]}
                >
                    <Select
                        size="large"
                        placeholder="Select Category"
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        options={categories.map((c) => ({
                            value: c.id,
                            label: c.name,
                        }))}
                    />
                </Form.Item>

                <Row gutter={16}>
                    {/* Qty */}
                    <Col span={12}>
                        <Form.Item
                            label="Quantity (Qty)"
                            name="qty"
                            rules={[
                                {
                                    required: true,
                                    message: "Quantity is required",
                                },
                                {
                                    type: "number",
                                    min: 0,
                                    message: "Qty must be 0 or more",
                                },
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                precision={0}
                                placeholder="0"
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>

                    {/* MOQ */}
                    <Col span={12}>
                        <Form.Item
                            label="MOQ"
                            name="moq"
                            dependencies={["qty"]}
                            rules={[
                                {
                                    required: true,
                                    message: "MOQ is required",
                                },
                                {
                                    type: "number",
                                    min: 1,
                                    message: "MOQ must be at least 1",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const qty = getFieldValue("qty");
                                        if (
                                            value &&
                                            qty !== undefined &&
                                            Number(value) > Number(qty)
                                        ) {
                                            return Promise.reject(
                                                new Error(
                                                    "MOQ cannot exceed Quantity",
                                                ),
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={1}
                                precision={0}
                                placeholder="1"
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {/* Purchase Price */}
                    <Col span={8}>
                        <Form.Item
                            label="Purchase Price (£)"
                            name="purchase_price"
                            rules={[
                                {
                                    required: true,
                                    message: "Purchase price is required",
                                },
                                {
                                    type: "number",
                                    min: 0,
                                    message: "Must be 0 or more",
                                },
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                precision={2}
                                prefix="£"
                                placeholder="0.00"
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>

                    {/* Selling Price */}
                    <Col span={8}>
                        <Form.Item
                            label="Selling Price (£)"
                            name="selling_price"
                            dependencies={["purchase_price"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Selling price is required",
                                },
                                {
                                    type: "number",
                                    min: 0,
                                    message: "Must be 0 or more",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const purchase =
                                            getFieldValue("purchase_price");
                                        if (
                                            value !== undefined &&
                                            purchase !== undefined &&
                                            Number(value) < Number(purchase)
                                        ) {
                                            return Promise.reject(
                                                new Error(
                                                    "Cannot be less than purchase price",
                                                ),
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                precision={2}
                                prefix="£"
                                placeholder="0.00"
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>

                    {/* VAT */}
                    <Col span={8}>
                        <Form.Item
                            label="VAT Rate"
                            name="vat"
                            rules={[
                                { required: true, message: "VAT is required" },
                            ]}
                        >
                            <Select className="w-full!" size="large">
                                <Select.Option value={0}>0%</Select.Option>
                                <Select.Option value={20}>20%</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
