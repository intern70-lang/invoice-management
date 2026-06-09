// resources/js/Pages/Admin/Invoices.jsx

import { Head, router, Link } from "@inertiajs/react";
import { Button, Typography, Space, Popconfirm, Tooltip, Tag } from "antd";
import { FilePlus, Eye, Trash2, FileText } from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";
import CustomTable from "@/Components/Ui/CustomTable";

const { Text } = Typography;

export default function Invoices({ invoices }) {
    const handleDelete = (invoice) => {
        router.delete(`/admin/invoices/${invoice.id}`, {
            preserveScroll: true,
        });
    };

    const columns = [
        {
            title: "Invoice #",
            dataIndex: "invoice_number",
            key: "invoice_number",
            render: (num) => (
                <Text strong className="text-(--primary)">
                    {num}
                </Text>
            ),
        },
        {
            title: "Customer",
            key: "customer",
            render: (_, record) => (
                <Text strong>{record.customer?.name ?? "—"}</Text>
            ),
        },
        {
            title: "Date",
            dataIndex: "invoice_date",
            key: "invoice_date",
            render: (date) =>
                date ? (
                    <Text type="secondary">
                        {new Date(date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </Text>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Created By",
            key: "creator",
            render: (_, record) => (
                <Text type="secondary">{record.creator?.name ?? "—"}</Text>
            ),
        },
        {
            title: "VAT",
            dataIndex: "total_vat",
            key: "total_vat",
            align: "right",
            render: (val, record) => (
                <Text type="secondary">
                    {record.currency_symbol}
                    {parseFloat(val).toFixed(2)}
                </Text>
            ),
        },
        {
            title: "Total",
            dataIndex: "total_amount",
            key: "total_amount",
            align: "right",
            render: (val, record) => (
                <Text strong>
                    {record.currency_symbol}
                    {parseFloat(val).toFixed(2)}
                </Text>
            ),
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (_, record) => {
                const current = record.status === "paid" ? "paid" : "unpaid";

                return (
                    <Tag color={current === "paid" ? "green" : "red"}>
                        {current === "paid" ? "Paid" : "Unpaid"}
                    </Tag>
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_, record) => {
                const isPaid = record.status === "paid";

                return (
                    <Space size="small">
                        {/* Toggle paid/unpaid (Action column only) */}
                        <Button
                            size="small"
                            type={isPaid ? "default" : "primary"}
                            onClick={() => {
                                router.patch(
                                    `/admin/invoices/${record.id}/status`,
                                    { status: isPaid ? "unpaid" : "paid" },
                                    { preserveScroll: true },
                                );
                            }}
                        >
                            {isPaid ? "Mark Unpaid" : "Mark Paid"}
                        </Button>

                        <Tooltip title="View Invoice">
                            <Link href={`/admin/invoices/${record.id}`}>
                                <Button size="small" icon={<Eye size={13} />} />
                            </Link>
                        </Tooltip>

                        <Popconfirm
                            title="Delete invoice?"
                            description={`Are you sure you want to delete "${record.invoice_number}"?`}
                            onConfirm={() => handleDelete(record)}
                            okText="Delete"
                            cancelText="Cancel"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Delete Invoice">
                                <Button
                                    size="small"
                                    danger
                                    icon={<Trash2 size={13} />}
                                />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Invoices" />

            <AppLayout title="Invoices">
                <div className="space-y-5">
                    {/* Page header */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--primary) flex items-center justify-center">
                                <FileText size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-(--text-primary) m-0!">
                                    Invoices
                                </h2>
                                <p className="text-xs text-(--text-secondary) mt-0.5 m-0!">
                                    {invoices.length} total invoice
                                    {invoices.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        <Link href="/admin/invoices/create">
                            <Button
                                type="primary"
                                icon={<FilePlus size={15} />}
                            >
                                New Invoice
                            </Button>
                        </Link>
                    </div>

                    <CustomTable
                        columns={columns}
                        data={invoices}
                        rowKey="id"
                        pagination={{
                            pageSize: 15,
                            showSizeChanger: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total}`,
                        }}
                    />
                </div>
            </AppLayout>
        </>
    );
}
