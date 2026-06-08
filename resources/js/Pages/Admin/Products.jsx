// resources/js/Pages/Admin/Products.jsx

import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Button,
    Tag,
    Space,
    Typography,
    Popconfirm,
    Tooltip,
    Input,
    Badge,
    Avatar,
} from "antd";
import {
    PackagePlus,
    Pencil,
    Trash2,
    Search,
    Package,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";
import CustomTable from "@/Components/Ui/CustomTable";
import ProductFormModal from "@/Components/Ui/ProductFormModal";

const { Text } = Typography;

export default function Products({ products, categories, manufacturers = [] }) {
    // ── Modal state ──────────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // ── Search / filter ──────────────────────────────────────────────────────
    const [search, setSearch] = useState("");

    const filtered = products.filter((p) => {
        const q = search.toLowerCase();
        return (
            p.name?.toLowerCase().includes(q) ||
            p.item_code?.toLowerCase().includes(q) ||
            p.category?.name?.toLowerCase().includes(q) ||
            p.manufacturer?.name?.toLowerCase().includes(q) ||
            p.regional_name?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        );
    });

    console.log("Filtered products:", filtered);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const openAdd = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleToggle = (product) => {
        router.patch(
            `/admin/products/${product.id}/toggle`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (product) => {
        router.delete(`/admin/products/${product.id}`, {
            preserveScroll: true,
        });
    };

    // ── Table columns ────────────────────────────────────────────────────────
    const columns = [
        {
            title: "#",
            key: "index",
            width: 50,
            render: (_, __, index) => (
                <Text type="secondary" className="text-xs">
                    {index + 1}
                </Text>
            ),
        },
        {
            title: "Product",
            key: "name",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        shape="square"
                        size={42}
                        src={record.image ? `/${record.image}` : null}
                        icon={!record.image ? <Package size={18} /> : null}
                    />
                    <div className="min-w-0">
                        <Text strong>{record.name}</Text>
                        <p className="text-xs text-(--text-secondary) m-0 mt-0.5">
                            {record.item_code || "No code"}
                            {record.regional_name ? ` · ${record.regional_name}` : ""}
                        </p>
                        {record.description && (
                            <p className="text-xs text-(--text-secondary) m-0 mt-0.5 max-w-xs truncate">
                                {record.description}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Category",
            key: "category",
            render: (_, record) =>
                record.category ? (
                    <Tag>{record.category.name}</Tag>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Manufacturer",
            key: "manufacturer",
            render: (_, record) =>
                record.manufacturer ? (
                    <Text>{record.manufacturer.name}</Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Class",
            dataIndex: "item_class",
            key: "item_class",
            render: (value) => (
                <Tag>
                    {{
                        general: "General",
                        sale_only: "Sale Only",
                        raw_material: "Raw Material",
                    }[value] || value}
                </Tag>
            ),
        },
        {
            title: "Prices",
            key: "prices",
            align: "right",
            render: (_, record) => (
                <div>
                    <Text type="secondary">
                        Buy £{Number(record.purchase_price).toFixed(2)}
                    </Text>
                    <br />
                    <Text strong>
                        Sale £{Number(record.selling_price).toFixed(2)}
                    </Text>
                </div>
            ),
        },
        {
            title: "Qty",
            dataIndex: "qty",
            key: "qty",
            align: "right",
            render: (qty) => (
                <Text className={qty === 0 ? "text-red-500" : ""}>{qty}</Text>
            ),
        },
        {
            title: "VAT",
            dataIndex: "vat",
            key: "vat",
            align: "center",
            render: (vat) => <Text type="secondary">{vat}%</Text>,
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) =>
                record.is_active ? (
                    <Badge status="success" text="Active" />
                ) : (
                    <Badge status="default" text="Inactive" />
                ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title={record.is_active ? "Disable" : "Enable"}>
                        <Button
                            size="small"
                            type={record.is_active ? "default" : "primary"}
                            icon={
                                record.is_active ? (
                                    <ToggleRight size={13} />
                                ) : (
                                    <ToggleLeft size={13} />
                                )
                            }
                            onClick={() => handleToggle(record)}
                        />
                    </Tooltip>

                    <Tooltip title="Edit Product">
                        <Button
                            size="small"
                            icon={<Pencil size={13} />}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Delete product?"
                        description={`Are you sure you want to delete "${record.name}"?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Product">
                            <Button
                                size="small"
                                danger
                                icon={<Trash2 size={13} />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <Head title="Products" />

            <AppLayout title="Products">
                <div className="space-y-5">
                    {/* Page header */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--primary) flex items-center justify-center">
                                <Package size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-(--text-primary) m-0!">
                                    Products
                                </h2>
                                <p className="text-xs text-(--text-secondary) mt-0.5 m-0!">
                                    {products.length} total product
                                    {products.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Input
                                prefix={
                                    <Search
                                        size={14}
                                        className="text-(--text-secondary)"
                                    />
                                }
                                placeholder="Search products…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                allowClear
                                style={{ width: 220 }}
                            />
                            <Button
                                type="primary"
                                icon={<PackagePlus size={15} />}
                                onClick={openAdd}
                            >
                                Add Product
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <CustomTable
                        columns={columns}
                        data={filtered}
                        rowKey="id"
                        pagination={{
                            pageSize: 15,
                            showSizeChanger: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total}`,
                        }}
                    />
                </div>

                {/* Add / Edit Modal */}
                <ProductFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    product={editingProduct}
                    categories={categories}
                    manufacturers={manufacturers}
                />
            </AppLayout>
        </>
    );
}
