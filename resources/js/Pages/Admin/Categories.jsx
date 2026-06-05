// resources/js/Pages/Admin/Categories.jsx

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
    Switch,
    Badge,
} from "antd";
import {
    TagIcon,
    Pencil,
    Trash2,
    Search,
    ToggleRight,
    ToggleLeft,
} from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";
import CustomTable from "@/Components/Ui/CustomTable";
import CategoryFormModal from "@/Components/Ui/CategoryFormModal";

const { Text } = Typography;

export default function Categories({ categories }) {
    // ── Modal state ──────────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // ── Search / filter ──────────────────────────────────────────────────────
    const [search, setSearch] = useState("");

    const filtered = categories.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()),
    );

    // ── Handlers ─────────────────────────────────────────────────────────────
    const openAdd = () => {
        setEditingCategory(null);
        setModalOpen(true);
    };

    const openEdit = (category) => {
        setEditingCategory(category);
        setModalOpen(true);
    };

    const handleToggle = (category) => {
        router.patch(
            `/admin/categories/${category.id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (category) => {
        router.delete(`/admin/categories/${category.id}`, {
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
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-(--primary) flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {name?.charAt(0)?.toUpperCase()}
                    </div>
                    <Text strong>{name}</Text>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "is_active",
            key: "is_active",
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

                    <Tooltip title="Edit Category">
                        <Button
                            size="small"
                            icon={<Pencil size={13} />}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Delete category?"
                        description={`Are you sure you want to delete "${record.name}"?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Category">
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
            <Head title="Categories" />

            <AppLayout title="Categories">
                <div className="space-y-5">
                    {/* Page header */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--primary) flex items-center justify-center">
                                <TagIcon size={20} />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-(--text-primary) m-0!">
                                    Categories
                                </h2>
                                <p className="text-xs text-(--text-secondary) mt-0.5 m-0!">
                                    {categories.length} total categor
                                    {categories.length !== 1 ? "ies" : "y"}
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
                                placeholder="Search categories…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                allowClear
                                style={{ width: 220 }}
                            />
                            <Button
                                type="primary"
                                icon={<TagIcon size={15} />}
                                onClick={openAdd}
                            >
                                Add Category
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

                {/* Reusable Add / Edit Modal */}
                <CategoryFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    category={editingCategory}
                />
            </AppLayout>
        </>
    );
}
