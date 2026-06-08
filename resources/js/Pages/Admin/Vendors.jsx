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
    Truck,
    Pencil,
    Trash2,
    Search,
    ToggleRight,
    ToggleLeft,
} from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";
import CustomTable from "@/Components/Ui/CustomTable";
import VendorFormModal from "@/Components/Ui/VendorFormModal";

const { Text } = Typography;

export default function Vendors({ vendors }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [search, setSearch] = useState("");

    const filtered = vendors.filter((vendor) => {
        const term = search.toLowerCase();
        return (
            vendor.name?.toLowerCase().includes(term) ||
            vendor.company?.toLowerCase().includes(term) ||
            vendor.phone?.toLowerCase().includes(term) ||
            vendor.email?.toLowerCase().includes(term) ||
            vendor.city?.toLowerCase().includes(term)
        );
    });

    const openAdd = () => {
        setEditingVendor(null);
        setModalOpen(true);
    };

    const openEdit = (vendor) => {
        setEditingVendor(vendor);
        setModalOpen(true);
    };

    const handleToggle = (vendor) => {
        router.patch(
            `/admin/vendors/${vendor.id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (vendor) => {
        router.delete(`/admin/vendors/${vendor.id}`, {
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
            title: "Vendor",
            dataIndex: "name",
            key: "name",
            render: (name, record) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-(--primary) flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <Text strong>{name}</Text>
                        {record.company && (
                            <div className="text-xs text-(--text-secondary) truncate">
                                {record.company}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (phone) => phone || <Text type="secondary">-</Text>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => email || <Text type="secondary">-</Text>,
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
            render: (city) => city || <Text type="secondary">-</Text>,
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

                    <Tooltip title="Edit Vendor">
                        <Button
                            size="small"
                            icon={<Pencil size={13} />}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Delete vendor?"
                        description={`Are you sure you want to delete "${record.name}"?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Vendor">
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
            <Head title="Vendors" />

            <AppLayout title="Vendors">
                <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--primary) flex items-center justify-center">
                                <Truck size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-(--text-primary) m-0!">
                                    Vendors
                                </h2>
                                <p className="text-xs text-(--text-secondary) mt-0.5 m-0!">
                                    {vendors.length} total vendor
                                    {vendors.length !== 1 ? "s" : ""}
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
                                placeholder="Search vendors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                allowClear
                                style={{ width: 240 }}
                            />
                            <Button
                                type="primary"
                                icon={<Truck size={15} />}
                                onClick={openAdd}
                            >
                                Add Vendor
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

                <VendorFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    vendor={editingVendor}
                />
            </AppLayout>
        </>
    );
}
