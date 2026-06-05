import { Head, Link } from "@inertiajs/react";
import { Button, Card, Divider, Table, Typography } from "antd";

import { ArrowLeft, Printer } from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";
import { formatDate } from "../../utils";

const { Title, Text } = Typography;

export default function ShowInvoice({ invoice, settings }) {
    const currency = settings?.currency_symbol || "";

    const columns = [
        {
            title: "Product",
            dataIndex: "product_name",
        },
        {
            title: "Price",
            align: "right",
            render: (_, row) =>
                `${currency}${Number(row.selling_price).toFixed(2)}`,
        },
        {
            title: "VAT %",
            dataIndex: "vat_percent",
            align: "center",
            render: (value) => `${value}%`,
        },
        {
            title: "Qty",
            dataIndex: "qty",
            align: "right",
        },
        {
            title: "VAT Amount",
            align: "right",
            render: (_, row) =>
                `${currency}${Number(row.vat_amount).toFixed(2)}`,
        },
        {
            title: "Line Total",
            align: "right",
            render: (_, row) =>
                `${currency}${Number(row.line_total).toFixed(2)}`,
        },
    ];

    return (
        <AppLayout>
            <style>
                {`
@media print {

    body * {
        visibility: hidden;
    }

    #print-area,
    #print-area * {
        visibility: visible;
    }

    #print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        box-shadow: none !important;
        border: none !important;
    }

    .ant-layout-sider,
    .ant-layout-header,
    .ant-menu,
    button {
        display: none !important;
    }
}
`}
            </style>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between mb-6 print:hidden">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/invoices">
                            <Button icon={<ArrowLeft size={16} />} />
                        </Link>

                        <Title level={4} style={{ margin: 0 }}>
                            {invoice.invoice_number}
                        </Title>
                    </div>

                    <Button
                        type="primary"
                        icon={<Printer size={16} />}
                        onClick={() => window.print()}
                    >
                        Print
                    </Button>
                </div>

                <Card id="print-area">
                    <div className="flex justify-between mb-10">
                        <div>
                            {settings.logo && (
                                <img
                                    src={`/storage/${settings.logo}`}
                                    alt="Logo"
                                    className="h-12 mb-3"
                                />
                            )}

                            <Title level={3}>{settings.app_name}</Title>

                            {settings.address && (
                                <Text type="secondary" className="block">
                                    {settings.address}
                                </Text>
                            )}

                            {settings.phone && (
                                <Text type="secondary" className="block">
                                    {settings.phone}
                                </Text>
                            )}

                            {settings.email && (
                                <Text type="secondary" className="block">
                                    {settings.email}
                                </Text>
                            )}
                        </div>

                        <div className="text-right">
                            <Title level={2}>INVOICE</Title>

                            <Text strong>{invoice.invoice_number}</Text>

                            <br />

                            <Text type="secondary">
                                Date: {formatDate(invoice.invoice_date)}
                            </Text>

                            <br />

                            <Text type="secondary">
                                Due Date: {formatDate(invoice.due_date)}
                            </Text>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 mb-8">
                        <div className="space-y-1!">
                            <Text strong>Bill To</Text>

                            <Divider className="mt-2!" />

                            <p>{invoice.customer.name}</p>

                            {invoice.customer.email && (
                                <p>{invoice.customer.email}</p>
                            )}

                            {invoice.customer.phone && (
                                <p>{invoice.customer.phone}</p>
                            )}

                            {invoice.customer.address && (
                                <p>{invoice.customer.address}</p>
                            )}

                            {invoice.customer.vat_registered &&
                                invoice.customer.vat_number && (
                                    <p>
                                        VAT No:{" "}
                                        <strong>
                                            {invoice.customer.vat_number}
                                        </strong>
                                    </p>
                                )}
                        </div>

                        {(settings.bank_name || settings.iban) && (
                            <div className="space-y-1!">
                                <Text strong>Payment Details</Text>

                                <Divider className="mt-2!" />

                                {settings.bank_name && (
                                    <p>Bank: {settings.bank_name}</p>
                                )}

                                {settings.iban && <p>IBAN: {settings.iban}</p>}

                                {settings.swift_code && (
                                    <p>SWIFT: {settings.swift_code}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <Table
                        rowKey="id"
                        pagination={false}
                        columns={columns}
                        dataSource={invoice.items}
                    />

                    <div className="mt-6">
                        <Text type="secondary">
                            Remarks: {invoice.remarks || "No remarks"}
                        </Text>
                    </div>

                    <div className="flex justify-end mt-8">
                        <div className="w-72">
                            <div className="flex justify-between mb-2">
                                <Text>Total VAT</Text>

                                <Text>
                                    {currency}
                                    {Number(invoice.total_vat).toFixed(2)}
                                </Text>
                            </div>

                            <div className="flex justify-between">
                                <Title level={5}>Total Amount</Title>

                                <Title level={5}>
                                    {currency}
                                    {Number(invoice.total_amount).toFixed(2)}
                                </Title>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div className="text-center text-gray-500">
                        Thank you for your business! Generated by{" "}
                        {settings.app_name}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
