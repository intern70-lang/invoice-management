import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Button,
    Space,
    Typography,
    Popconfirm,
    Tooltip,
    Input,
    Badge,
} from "antd";
import {
    Factory,
    Pencil,
    Trash2,
    Search,
    ToggleRight,
    ToggleLeft,
} from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";
import CustomTable from "@/Components/Ui/CustomTable";
import ManufacturerFormModal from "@/Components/Ui/ManufacturerFormModal";

const { Text } = Typography;

export default function Manufacturers({ manufacturers }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingManufacturer, setEditingManufacturer] = useState(null);
    const [search, setSearch] = useState("");

    const filtered = manufacturers.filter((manufacturer) => {
        const term = search.toLowerCase();
        return (
            manufacturer.name?.toLowerCase().includes(term) ||
            manufacturer.number?.toLowerCase().includes(term) ||
            manufacturer.email?.toLowerCase().includes(term)
        );
    });

    const openAdd = () => {
        setEditingManufacturer(null);
        setModalOpen(true);
    };

    const openEdit = (manufacturer) => {
        setEditingManufacturer(manufacturer);
        setModalOpen(true);
    };

    const handleToggle = (manufacturer) => {
        router.patch(
            `/admin/manufacturers/${manufacturer.id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (manufacturer) => {
        router.delete(`/admin/manufacturers/${manufacturer.id}`, {
            preserveScroll: true,
        });
    };

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
            title: "Manufacturer",
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
            title: "Number",
            dataIndex: "number",
            key: "number",
            render: (number) => number || <Text type="secondary">-</Text>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => email || <Text type="secondary">-</Text>,
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

                    <Tooltip title="Edit Manufacturer">
                        <Button
                            size="small"
                            icon={<Pencil size={13} />}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Delete manufacturer?"
                        description={`Are you sure you want to delete "${record.name}"?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Manufacturer">
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

    return (
        <>
            <Head title="Manufacturers" />

            <AppLayout title="Manufacturers">
                <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--primary) flex items-center justify-center">
                                <Factory size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-(--text-primary) m-0!">
                                    Manufacturers
                                </h2>
                                <p className="text-xs text-(--text-secondary) mt-0.5 m-0!">
                                    {manufacturers.length} total manufacturer
                                    {manufacturers.length !== 1 ? "s" : ""}
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
                                placeholder="Search manufacturers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                allowClear
                                style={{ width: 240 }}
                            />
                            <Button
                                type="primary"
                                icon={<Factory size={15} />}
                                onClick={openAdd}
                            >
                                Add Manufacturer
                            </Button>
                        </div>
                    </div>

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

                <ManufacturerFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    manufacturer={editingManufacturer}
                />
            </AppLayout>
        </>
    );
}
