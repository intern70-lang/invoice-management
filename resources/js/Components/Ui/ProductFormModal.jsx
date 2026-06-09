import { useEffect, useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Divider,
    Row,
    Col,
    Image,
    Switch,
    message,
    Segmented,
    Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PackagePlus, PackageCheck } from "lucide-react";

const { TextArea } = Input;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const defaults = {
    _method: "",
    image: null,
    name: "",
    item_code: "",
    description: "",
    category_id: null,
    manufacturer_id: null,
    item_class: "general",
    hsn_code: "",
    regional_name: "",
    unit: "pcs",
    qty: 0,
    moq: 0,
    purchase_price: 0,
    purchase_tax_inclusive: false,
    selling_price: 0,
    vat: 0,
    sale_tax_inclusive: false,
    discount_percent: 0,
    cess_percent: 0,
    additional_cess: 0,
    is_weighing_item: false,
};

export default function ProductFormModal({
    open,
    onClose,
    product = null,
    categories = [],
    manufacturers = [],
}) {
    const isEdit = !!product;
    const [antForm] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [removeImage, setRemoveImage] = useState(false); // ✅ wired up below

    const { data, setData, reset } = useForm(defaults);
    const processing = submitting;

    useEffect(() => {
        if (!open) {
            reset();
            antForm.resetFields();
            setFileList([]);
            setImageFile(null);
            setFormErrors({});
            setRemoveImage(false); // ✅ reset flag on close
            return;
        }

        // 👇 Fetch next SKU only when adding a new product
        if (!product) {
            fetch('/admin/products/next-sku')
                .then(r => r.json())
                .then(({ sku }) => {
                    antForm.setFieldValue('item_code', sku);
                    setData('item_code', sku);
                });
        }

        const toNumber = (value, fallback = 0) =>
            value !== null && value !== undefined ? Number(value) : fallback;

        const values = {
            ...defaults,
            ...Object.fromEntries(
                Object.keys(defaults).map((key) => [
                    key,
                    product?.[key] ?? defaults[key],
                ]),
            ),
            qty: toNumber(product?.qty),
            moq: toNumber(product?.moq, 0),
            purchase_price: toNumber(product?.purchase_price),
            selling_price: toNumber(product?.selling_price),
            vat: toNumber(product?.vat),
            discount_percent: toNumber(product?.discount_percent),
            cess_percent: toNumber(product?.cess_percent),
            additional_cess: toNumber(product?.additional_cess),
            image: null,
            _method: product ? "PUT" : "",
        };

        setData(values);
        setImageFile(null);
        setRemoveImage(false); // ✅ reset flag when opening a fresh product
        antForm.setFieldsValue(values);
        setFileList(
            product?.image
                ? [
                    {
                        uid: "-1",
                        name: "product image",
                        status: "done",
                        url: `/${product.image}`,
                    },
                ]
                : [],
        );
        setFormErrors({});
    }, [open, product]);

    useEffect(() => {
        if (Object.keys(formErrors).length > 0) {
            antForm.setFields(
                Object.entries(formErrors)
                    .filter(([name]) => name !== "image")
                    .map(([name, msg]) => ({
                        name,
                        errors: [msg],
                    })),
            );
        }
    }, [formErrors]);

    const clearFieldError = (field) => {
        setFormErrors((current) => {
            if (!current[field]) return current;
            const next = { ...current };
            delete next[field];
            return next;
        });
    };

    const handleValuesChange = (changed) => {
        Object.entries(changed).forEach(([key, value]) => {
            if (key === "image") return;
            setData(key, value);
            antForm.setFields([{ name: key, errors: [] }]);
            clearFieldError(key);
        });
    };

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

    const handleImageChange = ({ fileList: newList }) => {
        const file = newList[0]?.originFileObj;

        if (file) {
            const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

            if (!allowedTypes.includes(file.type)) {
                message.error("Product image must be PNG, JPG, JPEG or WEBP.");
                return;
            }

            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                message.error(
                    `Product image must be ${MAX_IMAGE_SIZE_MB} MB or smaller.`,
                );
                return;
            }

            // ✅ User uploaded a new file — cancel any pending remove
            setRemoveImage(false);
        }

        setFileList(newList.slice(0, 1));
        setImageFile(file ?? null);
        setData("image", file ?? null);
        clearFieldError("image");
    };

    // ✅ Fired when user clicks the × on the uploaded image thumbnail
    const handleImageRemove = () => {
        setFileList([]);
        setImageFile(null);
        setData("image", null);
        clearFieldError("image");

        // Only set the flag in edit mode — in add mode there's no server image to delete
        if (isEdit) {
            setRemoveImage(true);
        }
    };

    const beforeImageUpload = (file) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            message.error("Product image must be PNG, JPG, JPEG or WEBP.");
            return Upload.LIST_IGNORE;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            message.error(
                `Product image must be ${MAX_IMAGE_SIZE_MB} MB or smaller.`,
            );
            return Upload.LIST_IGNORE;
        }

        return false; // prevent auto-upload
    };

    const handleSubmit = async () => {
        try {
            await antForm.validateFields();
        } catch {
            return;
        }

        const opts = {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => setSubmitting(true),
            onSuccess: () => onClose(),
            onError: (serverErrors) => setFormErrors(serverErrors),
            onFinish: () => setSubmitting(false),
        };

        router.post(
            isEdit ? `/admin/products/${product.id}` : "/admin/products/add",
            buildProductFormData(),
            opts,
        );
    };

    const buildProductFormData = () => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "image") return;
            if (value === null || value === undefined) return;
            if (key === "_method" && !value) return;

            if (typeof value === "boolean") {
                formData.append(key, value ? "1" : "0");
                return;
            }

            formData.append(key, value);
        });

        if (imageFile) {
            // New image selected — send the file
            formData.append("image", imageFile, imageFile.name);
        }

        // ✅ Tell Laravel to delete the existing image if user removed it in edit mode
        formData.append("remove_image", removeImage ? "1" : "0");

        return formData;
    };

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
                    <div className="bg-gray-50/10 text-white rounded-md p-1 w-8 h-8 flex items-center justify-center">
                        {isEdit ? (
                            <PackageCheck size={18} />
                        ) : (
                            <PackagePlus size={18} />
                        )}
                    </div>
                    <span>{isEdit ? "Edit Product" : "Add Product"}</span>
                </div>
            }
            width={900}
            forceRender
            destroyOnHidden
            maskClosable={!processing}
        >
            <Divider className="my-3!" />

            <Form
                form={antForm}
                layout="vertical"
                onValuesChange={handleValuesChange}
                size="middle"
                variant="filled"
                initialValues={defaults}
            >
                <Row gutter={16}>
                    <Col xs={24} md={5}>
                        <Form.Item
                            label="Image"
                            validateStatus={formErrors.image ? "error" : ""}
                            help={formErrors.image}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={beforeImageUpload}
                                onChange={handleImageChange}
                                onPreview={handlePreview}
                                onRemove={handleImageRemove} // ✅ wired up
                                maxCount={1}
                                accept="image/png,image/jpeg,image/webp"
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
                                        onOpenChange: setPreviewOpen,
                                        afterOpenChange: (visible) => {
                                            if (!visible) setPreviewImage("");
                                        },
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={19}>
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Product Name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Product name is required",
                                        },
                                        {
                                            pattern: /^[A-Za-z0-9\s().,&/-]+$/,
                                            message:
                                                "Only letters, numbers, spaces and common symbols are allowed",
                                        },
                                        {
                                            min: 2,
                                            message:
                                                "Product name must be at least 2 characters",
                                        },
                                        {
                                            max: 255,
                                            message:
                                                "Product name cannot exceed 255 characters",
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        autoComplete="off"
                                        placeholder="e.g. Apple iPhone 14"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Item Code"
                                    name="item_code"
                                >
                                    <Input
                                        size="large"
                                        autoComplete="off"
                                        readOnly
                                        placeholder="Auto-generated (e.g. SKU000001)"
                                        className="bg-gray-100 cursor-not-allowed"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Category"
                                    name="category_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Category is required",
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Select category"
                                        showSearch
                                        optionFilterProp="label"
                                        options={categories.map((c) => ({
                                            value: c.id,
                                            label: c.name,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Manufacturer"
                                    name="manufacturer_id"
                                >
                                    <Select
                                        size="large"
                                        placeholder="Select manufacturer"
                                        showSearch
                                        optionFilterProp="label"
                                        options={manufacturers.map((m) => ({
                                            value: m.id,
                                            label: m.name,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item label="Item Class" name="item_class">
                            <Select
                                size="large"
                                options={[
                                    { value: "general", label: "General" },
                                    { value: "sale_only", label: "Sale Only" },
                                    {
                                        value: "raw_material",
                                        label: "Raw Material",
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="HSN Code"
                            name="hsn_code"
                            normalize={(value) => value?.trimStart() ?? ""}
                            rules={[
                                {
                                    pattern: /^[A-Za-z0-9\s-]*$/,
                                    message:
                                        "HSN code may only contain letters, numbers, spaces and hyphens",
                                },
                                {
                                    max: 50,
                                    message:
                                        "HSN code cannot exceed 50 characters",
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                autoComplete="off"
                                placeholder="e.g. 85171200"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Regional Name"
                            name="regional_name"
                            rules={[
                                {
                                    max: 255,
                                    message:
                                        "Regional name may not exceed 255 characters",
                                },
                            ]}
                        >
                            <Input size="large" placeholder="e.g. iPhone 14" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={6}>
                        <Form.Item label="Unit" name="unit">
                            <Select
                                size="large"
                                showSearch
                                options={[
                                    { value: "pcs", label: "PCS" },
                                    { value: "kg", label: "KG" },
                                    { value: "g", label: "Gram" },
                                    { value: "ltr", label: "Litre" },
                                    { value: "mtr", label: "Metre" },
                                    { value: "box", label: "Box" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="Quantity"
                            name="qty"
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    message: "Quantity cannot be negative",
                                },
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                precision={0}
                                parser={(value) => value?.replace(/[^\d]/g, "")}
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="MOQ"
                            name="moq"
                            dependencies={["qty"]}
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    message: "MOQ cannot be negative",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const qty = getFieldValue("qty");
                                        if (
                                            value === null ||
                                            value === undefined ||
                                            qty === null ||
                                            qty === undefined
                                        ) {
                                            return Promise.resolve();
                                        }
                                        if (Number(value) > Number(qty)) {
                                            return Promise.reject(
                                                new Error(
                                                    "MOQ cannot be greater than Quantity",
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
                                precision={0}
                                parser={(value) => value?.replace(/[^\d]/g, "")}
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item label="Weighing Item" name="is_weighing_item">
                            <Segmented
                                block
                                size="large"
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Purchase Price"
                            name="purchase_price"
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    message:
                                        "Purchase price cannot be negative",
                                },
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                precision={2}
                                parser={(value) =>
                                    value?.replace(/[^\d.]/g, "")
                                }
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                        <Form.Item
                            label="Tax Inclusive"
                            name="purchase_tax_inclusive"
                        >
                            <Segmented
                                block
                                size="large"
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Sale Price"
                            name="selling_price"
                            dependencies={["purchase_price"]}
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    message: "Selling price cannot be negative",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const purchasePrice =
                                            getFieldValue("purchase_price");
                                        if (
                                            value == null ||
                                            purchasePrice == null
                                        ) {
                                            return Promise.resolve();
                                        }
                                        if (
                                            Number(value) <
                                            Number(purchasePrice)
                                        ) {
                                            return Promise.reject(
                                                new Error(
                                                    "Selling price cannot be less than purchase price",
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
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                        <Form.Item
                            label="Tax Inclusive"
                            name="sale_tax_inclusive"
                        >
                            <Segmented
                                block
                                size="large"
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="GST/VAT %"
                            name="vat"
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    max: 100,
                                    message:
                                        "GST/VAT must be between 0 and 100",
                                },
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                max={100}
                                precision={2}
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="Discount %"
                            name="discount_percent"
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    max: 100,
                                    message:
                                        "Discount must be between 0 and 100",
                                },
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                max={100}
                                precision={2}
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="Cess %"
                            name="cess_percent"
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    max: 100,
                                    message: "Cess must be between 0 and 100",
                                },
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                max={100}
                                precision={2}
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="Additional Cess"
                            name="additional_cess"
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    message:
                                        "Additional cess cannot be negative",
                                },
                            ]}
                        >
                            <InputNumber
                                size="large"
                                min={0}
                                precision={2}
                                className="w-full!"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {
                            max: 1000,
                            message:
                                "Description may not exceed 1000 characters",
                        },
                    ]}
                >
                    <TextArea
                        rows={3}
                        className="resize-none"
                        placeholder="Add some Details About your Product"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
