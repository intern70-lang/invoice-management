// resources/js/Pages/Admin/Customers.jsx

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
} from "antd";
import { UserPlus, Pencil, Trash2, Search, Users } from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";
import CustomTable from "@/Components/Ui/CustomTable";
import CustomerFormModal from "@/Components/Ui/CustomerFormModal";

const { Text } = Typography;

export default function Customers({ customers, areas = [] }) {
    // ── Modal state ──────────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    // ── Search / filter ──────────────────────────────────────────────────────
    const [search, setSearch] = useState("");

    const filtered = customers.filter((c) => {
        const q = search.toLowerCase();
        return (
            c.name?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.phone?.toLowerCase().includes(q) ||
            c.city?.toLowerCase().includes(q) ||
            c.area?.name?.toLowerCase().includes(q)
        );
    });

    // ── Handlers ─────────────────────────────────────────────────────────────
    const openAdd = () => {
        setEditingCustomer(null);
        setModalOpen(true);
    };

    const openEdit = (customer) => {
        setEditingCustomer(customer);
        setModalOpen(true);
    };

    const handleDelete = (customer) => {
        router.delete(`/admin/customers/${customer.id}`, {
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
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) =>
                email ? (
                    <Text type="secondary">{email}</Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (phone) =>
                phone ? (
                    <Text type="secondary">{phone}</Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Type",
            dataIndex: "customer_type",
            key: "customer_type",
            render: (type) => (
                <Tag
                    color={type === "company" ? "blue" : "default"}
                    className="capitalize"
                >
                    {type || "individual"}
                </Tag>
            ),
        },
        {
            title: "Area",
            key: "area",
            render: (_, record) =>
                record.area?.name ? (
                    <Text type="secondary">{record.area.name}</Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
            render: (city) =>
                city ? (
                    <Text type="secondary">{city}</Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Credit Limit",
            dataIndex: "credit_amount",
            key: "credit_amount",
            render: (amount) =>
                amount ? (
                    <Text type="secondary">{Number(amount).toFixed(2)}</Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit Customer">
                        <Button
                            size="small"
                            icon={<Pencil size={13} />}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Delete customer?"
                        description={`Are you sure you want to delete "${record.name}"?`}
                        onConfirm={() => handleDelete(record)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete Customer">
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
            <Head title="Customers" />

            <AppLayout title="Customers">
                <div className="space-y-5">
                    {/* Page header */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--primary) flex items-center justify-center">
                                <Users size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-(--text-primary) m-0!">
                                    Customers
                                </h2>
                                <p className="text-xs text-(--text-secondary) mt-0.5 m-0!">
                                    {customers.length} total customer
                                    {customers.length !== 1 ? "s" : ""}
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
                                placeholder="Search customers…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                allowClear
                                style={{ width: 220 }}
                            />
                            <Button
                                type="primary"
                                icon={<UserPlus size={15} />}
                                onClick={openAdd}
                            >
                                Add Customer
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
                <CustomerFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    customer={editingCustomer}
                    mode="page"
                    areas={areas}
                />
            </AppLayout>
        </>
    );
}
