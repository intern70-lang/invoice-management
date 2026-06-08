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
    moq: 1,
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
    const fileInputRef = useRef(null);

    const { data, setData, reset } = useForm(defaults);
    const processing = submitting;

    useEffect(() => {
        if (!open) {
            reset();
            antForm.resetFields();
            setFileList([]);
            setImageFile(null);
            setFormErrors({});
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        const values = {
            ...defaults,
            ...Object.fromEntries(
                Object.keys(defaults).map((key) => [key, product?.[key] ?? defaults[key]]),
            ),
            image: null,
            _method: product ? "PUT" : "",
        };

        setData(values);
        setImageFile(null);
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

    const handlePreview = async () => {
        const file = fileList[0];
        if (!file) return;

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleImageRemove = () => {
        const currentUrl = fileList[0]?.url;
        if (currentUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(currentUrl);
        }

        setFileList([]);
        setImageFile(null);
        setData("image", null);
        clearFieldError("image");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleNativeImageChange = (event) => {
        const file = event.target.files?.[0] ?? null;
        if (!file) return;

        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
            message.error("Product image must be PNG, JPG, JPEG or WEBP.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            message.error(`Product image must be ${MAX_IMAGE_SIZE_MB} MB or smaller.`);
            event.target.value = "";
            return;
        }

        const currentUrl = fileList[0]?.url;
        if (currentUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(currentUrl);
        }

        setFileList([
            {
                uid: String(Date.now()),
                name: file.name,
                status: "done",
                url: URL.createObjectURL(file),
                originFileObj: file,
            },
        ]);
        setImageFile(file);
        setData("image", file);
        clearFieldError("image");
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

        console.log("Submitting product form with data:", { ...data, image: imageFile });

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

            // Skip empty _method on create
            if (key === "_method" && !value) return;

            if (typeof value === "boolean") {
                formData.append(key, value ? "1" : "0");
                return;
            }

            formData.append(key, value);
        });

        if (imageFile) {
            formData.append("image", imageFile, imageFile.name);
        }

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
                        {isEdit ? <PackageCheck size={18} /> : <PackagePlus size={18} />}
                    </div>
                    <span>{isEdit ? "Edit Product" : "Add Product"}</span>
                </div>
            }
            width={900}
            forceRender
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
                initialValues={defaults}
            >
                <Row gutter={16}>
                    <Col xs={24} md={5}>
                        <Form.Item
                            label="Image"
                            validateStatus={formErrors.image ? "error" : ""}
                            help={formErrors.image}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={handleNativeImageChange}
                            />
                            {fileList.length >= 1 ? (
                                <div className="relative w-[102px]">
                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        className="w-[102px] h-[102px] rounded-lg overflow-hidden border border-(--border) bg-(--input-bg) p-1"
                                    >
                                        <img
                                            src={fileList[0].url}
                                            alt={fileList[0].name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs leading-none"
                                        aria-label="Remove product image"
                                    >
                                        x
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-[102px] h-[102px] rounded-lg border border-dashed border-(--border) bg-(--input-bg) flex flex-col items-center justify-center text-(--text-secondary)"
                                >
                                    <PlusOutlined />
                                    <div className="mt-2 text-xs">Upload</div>
                                </button>
                            )}
                            {previewImage && (
                                <Image
                                    style={{ display: "none" }}
                                    preview={{
                                        open: previewOpen,
                                        onOpenChange: setPreviewOpen,
                                        afterOpenChange: (v) => {
                                            if (!v) setPreviewImage("");
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
                                        { required: true, message: "Product name is required" },
                                        {
                                            pattern: /^[a-zA-Z0-9\s\-\(\)]+$/,
                                            message: "Product name may only contain letters, numbers, spaces, hyphens and parentheses",
                                        },
                                        { min: 2, message: "At least 2 characters" },
                                        { max: 255, message: "Product name may not exceed 255 characters" },
                                    ]}
                                >
                                    <Input size="large" autoComplete="off" placeholder="e.g. Apple iPhone 14" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Item Code"
                                    name="item_code"

                                    rules={[
                                        { required: true, message: "Item code is required" },
                                        {
                                            pattern: /^[a-zA-Z0-9\-_\/]+$/,
                                            message: "Item code may only contain letters, numbers, hyphens, underscores and slashes",
                                        },
                                        { max: 100, message: "Item code may not exceed 100 characters" },
                                    ]}
                                >
                                    <Input size="large" autoComplete="off" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Category" name="category_id" rules={[{ required: true, message: "Category is required" }]}>
                                    <Select size="large" placeholder="Select category" showSearch optionFilterProp="label" options={categories.map((c) => ({ value: c.id, label: c.name }))} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Manufacturer" name="manufacturer_id" rules={[{ required: true, message: "Manufacturer is required" }]}>
                                    <Select size="large" placeholder="Select manufacturer" showSearch optionFilterProp="label" options={manufacturers.map((m) => ({ value: m.id, label: m.name }))} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item label="Item Class" name="item_class" rules={[{ required: true, message: "Item class is required" }]}>
                            <Select size="large" options={[
                                { value: "general", label: "General" },
                                { value: "sale_only", label: "Sale Only" },
                                { value: "raw_material", label: "Raw Material" },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="HSN Code"
                            name="hsn_code"
                            placeholder="e.g. 85171200"
                            normalize={(value) => value?.trimStart() ?? ""}
                            rules={[
                                {
                                    pattern: /^[a-zA-Z0-9\-\s]*$/,
                                    message: "HSN code may only contain letters, numbers, spaces and hyphens",
                                },
                                { max: 50, message: "HSN code may not exceed 50 characters" },
                            ]}
                        >
                            <Input size="large" autoComplete="off" placeholder="e.g. 85171200" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Regional Name"
                            name="regional_name"
                            rules={[
                                { max: 255, message: "Regional name may not exceed 255 characters" },
                            ]}
                        >
                            <Input size="large" placeholder="e.g. iPhone 14" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={6}>
                        <Form.Item label="Unit" name="unit" rules={[{ required: true, message: "Unit is required" }, { max: 50, message: "Unit may not exceed 50 characters" }]}>
                            <Select size="large" showSearch options={[
                                { value: "pcs", label: "PCS" },
                                { value: "kg", label: "KG" },
                                { value: "g", label: "Gram" },
                                { value: "ltr", label: "Litre" },
                                { value: "mtr", label: "Metre" },
                                { value: "box", label: "Box" },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item label="Quantity" name="qty" rules={[{ required: true, message: "Quantity is required" }, { type: "number", min: 0, message: "Quantity cannot be negative" }]}>
                            <InputNumber size="large" min={0} precision={0} className="w-full!" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item label="MOQ" name="moq" rules={[{ required: true, message: "MOQ is required" }, { type: "number", min: 1, message: "MOQ must be at least 1" }]}>
                            <InputNumber size="large" min={1} precision={0} className="w-full!" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item label="Weighing Item" name="is_weighing_item" valuePropName="checked">
                            <Switch checkedChildren="Yes" unCheckedChildren="No" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item label="Purchase Price" name="purchase_price" rules={[{ required: true, message: "Purchase price is required" }, { type: "number", min: 0, message: "Purchase price cannot be negative" }]}>
                            <InputNumber size="large" min={0} precision={2} className="w-full!" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                        <Form.Item label="Tax Inclusive" name="purchase_tax_inclusive" valuePropName="checked">
                            <Switch checkedChildren="Yes" unCheckedChildren="No" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Sale Price"
                            name="selling_price"
                            dependencies={["purchase_price"]}
                            rules={[
                                { required: true, message: "Sale price is required" },
                                { type: "number", min: 0, message: "Sale price cannot be negative" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const purchasePrice = getFieldValue("purchase_price");
                                        if (value === null || value === undefined || purchasePrice === null || purchasePrice === undefined) {
                                            return Promise.resolve();
                                        }

                                        if (Number(value) < Number(purchasePrice)) {
                                            return Promise.reject(new Error("Sale price cannot be less than purchase price"));
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber size="large" min={0} precision={2} className="w-full!" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                        <Form.Item label="Tax Inclusive" name="sale_tax_inclusive" valuePropName="checked">
                            <Switch checkedChildren="Yes" unCheckedChildren="No" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={6}>
                        <Form.Item label="GST/VAT %" name="vat" rules={[{ required: true, message: "GST/VAT is required" }, { type: "number", min: 0, max: 100, message: "GST/VAT must be between 0 and 100" }]}>
                            <InputNumber size="large" min={0} max={100} precision={2} className="w-full!" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item label="Discount %" name="discount_percent" rules={[{ type: "number", min: 0, max: 100, message: "Discount must be between 0 and 100" }]}>
                            <InputNumber size="large" min={0} max={100} precision={2} className="w-full!" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item label="Cess %" name="cess_percent" rules={[{ type: "number", min: 0, max: 100, message: "Cess must be between 0 and 100" }]}>
                            <InputNumber size="large" min={0} max={100} precision={2} className="w-full!" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item label="Additional Cess" name="additional_cess" rules={[{ type: "number", min: 0, message: "Additional cess cannot be negative" }]}>
                            <InputNumber size="large" min={0} precision={2} className="w-full!" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Description" name="description" rules={[{ max: 1000, message: "Description may not exceed 1000 characters" }]}>
                    <TextArea rows={3} className="resize-none" placeholder="Add some Details About your Product" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
