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
    MapPin,
    Pencil,
    Trash2,
    Search,
    ToggleRight,
    ToggleLeft,
} from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";
import CustomTable from "@/Components/Ui/CustomTable";
import AreaFormModal from "@/Components/Ui/AreaFormModal";

const { Text } = Typography;

export default function Areas({ areas }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [search, setSearch] = useState("");

    const filtered = areas.filter((area) =>
        area.name?.toLowerCase().includes(search.toLowerCase()),
    );

    const openAdd = () => {
        setEditingArea(null);
        setModalOpen(true);
    };

    const openEdit = (area) => {
        setEditingArea(area);
        setModalOpen(true);
    };

    const handleToggle = (area) => {
        router.patch(
            `/admin/areas/${area.id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (area) => {
        router.delete(`/admin/areas/${area.id}`, {
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

                    <Tooltip title="Edit Area">
                        <Button
                            size="small"
                            icon={<Pencil size={13} />}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Delete area?"
                        description={`Are you sure you want to delete "${record.name}"?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Area">
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
            <Head title="Areas" />

            <AppLayout title="Areas">
                <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--primary) flex items-center justify-center">
                                <MapPin size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-(--text-primary) m-0!">
                                    Areas
                                </h2>
                                <p className="text-xs text-(--text-secondary) mt-0.5 m-0!">
                                    {areas.length} total area
                                    {areas.length !== 1 ? "s" : ""}
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
                                placeholder="Search areas..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                allowClear
                                style={{ width: 220 }}
                            />
                            <Button
                                type="primary"
                                icon={<MapPin size={15} />}
                                onClick={openAdd}
                            >
                                Add Area
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

                <AreaFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    area={editingArea}
                />
            </AppLayout>
        </>
    );
}
