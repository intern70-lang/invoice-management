import { Head, Link, router } from "@inertiajs/react";
import { Table, Tag, Typography, Divider, theme, Button } from "antd";

import { ArrowLeft, Printer } from "lucide-react";



import AppLayout from "@/Layouts/AppLayout";
import { formatDate } from "../../utils";

const { Text, Title } = Typography;

export default function ShowInvoice({ invoice, settings }) {
    const { token } = theme.useToken();
    const currency = settings?.currency_symbol ?? "";

    const columns = [
        {
            title: "Product",
            dataIndex: "product_name",
            key: "product_name",
        },
        {
            title: "Price",
            align: "right",
            key: "selling_price",
            render: (_, row) => `${currency}${Number(row.selling_price).toFixed(2)}`,
        },
        {
            title: "VAT %",
            align: "center",
            key: "vat_percent",
            render: (value) => `${value}%`,
        },
        {
            title: "Qty",
            align: "right",
            dataIndex: "qty",
            key: "qty",
        },
        {
            title: "VAT Amount",
            align: "right",
            key: "vat_amount",
            render: (_, row) => `${currency}${Number(row.vat_amount).toFixed(2)}`,
        },
        {
            title: "Line Total",
            align: "right",
            key: "line_total",
            render: (_, row) => `${currency}${Number(row.line_total).toFixed(2)}`,
        },
    ];

    return (
        <>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <AppLayout title="Invoice">
                <style>{`
                    @media print {
                        @page {
                            size: A4;
                            margin: 20mm 15mm;
                        }
                        body * { visibility: hidden; }
                        #print-area,
                        #print-area * { visibility: visible; }
                        #print-area {
                            position: fixed;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 0 !important;
                            margin: 0 !important;
                            border: none !important;
                            border-radius: 0 !important;
                            box-shadow: none !important;
                            background: #ffffff !important;
                        }
                        #print-area * {
                            color: #000000 !important;
                            border-color: #e0e0e0 !important;
                            background: transparent !important;
                        }
                        #print-area .invoice-title,
                        #print-area .invoice-total {
                            color: #467CD5 !important;
                        }
                    }
                `}</style>

                <div style={{ maxWidth: 860, margin: "0 auto" }}>
                    {/* Top bar */}
                    <div
                        className="print-hidden"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 24,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Link href="/agent/invoices">
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

                    <div
                        id="print-area"
                        style={{
                            background: token.colorBgContainer,
                            border: `1px solid ${token.colorBorderSecondary}`,
                            borderRadius: token.borderRadiusLG,
                            padding: "48px 56px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: 48,
                            }}
                        >
                            <div>
                                {settings?.logo && (
                                    <img
                                        src={`/storage/${settings.logo}`}
                                        alt="Logo"
                                        style={{ height: 48, marginBottom: 12, display: "block" }}
                                    />
                                )}
                                <Title level={3} style={{ margin: "0 0 8px" }}>
                                    {settings?.app_name}
                                </Title>
                                {settings?.address && (
                                    <Text type="secondary" style={{ display: "block", lineHeight: 1.7 }}>
                                        {settings.address}
                                    </Text>
                                )}
                                {settings?.phone && (
                                    <Text type="secondary" style={{ display: "block", lineHeight: 1.7 }}>
                                        {settings.phone}
                                    </Text>
                                )}
                                {settings?.email && (
                                    <Text type="secondary" style={{ display: "block", lineHeight: 1.7 }}>
                                        {settings.email}
                                    </Text>
                                )}
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <div
                                    className="invoice-title"
                                    style={{
                                        fontSize: 32,
                                        fontWeight: 700,
                                        letterSpacing: 3,
                                        color: token.colorPrimary,
                                        marginBottom: 12,
                                        lineHeight: 1,
                                    }}
                                >
                                    INVOICE
                                </div>
                                <Text strong style={{ fontSize: 15, display: "block", marginBottom: 6 }}>
                                    {invoice.invoice_number}
                                </Text>
                                <Text type="secondary" style={{ display: "block", lineHeight: 1.8 }}>
                                    Date: {formatDate(invoice.invoice_date)}
                                </Text>
                                <Text type="secondary" style={{ display: "block", lineHeight: 1.8 }}>
                                    Due: {formatDate(invoice.due_date)}
                                </Text>

                                <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "center" }}>
                                    <Tag color={invoice.status === "paid" ? "green" : "red"}>
                                        {invoice.status === "paid" ? "Paid" : "Unpaid"}
                                    </Tag>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        {invoice.status === "paid" ? (
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    router.patch(`/agent/invoices/${invoice.id}/status`, {
                                                        status: "unpaid",
                                                    })
                                                }
                                            >
                                                Mark Unpaid
                                            </Button>
                                        ) : (
                                            <Button
                                                size="small"
                                                type="primary"
                                                onClick={() =>
                                                    router.patch(`/agent/invoices/${invoice.id}/status`, {
                                                        status: "paid",
                                                    })
                                                }
                                            >
                                                Mark Paid
                                            </Button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <Divider style={{ margin: "0 0 36px" }} />

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 40,
                                marginBottom: 40,
                            }}
                        >
                            <div>
                                <Text
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        letterSpacing: 1.2,
                                        textTransform: "uppercase",
                                        color: token.colorTextTertiary,
                                        display: "block",
                                        marginBottom: 10,
                                    }}
                                >
                                    Bill To
                                </Text>
                                <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
                                    {invoice.customer?.name}
                                </Text>
                                {invoice.customer?.email && (
                                    <Text type="secondary" style={{ display: "block", lineHeight: 1.8 }}>
                                        {invoice.customer.email}
                                    </Text>
                                )}
                                {invoice.customer?.phone && (
                                    <Text type="secondary" style={{ display: "block", lineHeight: 1.8 }}>
                                        {invoice.customer.phone}
                                    </Text>
                                )}
                                {invoice.customer?.address && (
                                    <Text type="secondary" style={{ display: "block", lineHeight: 1.8 }}>
                                        {invoice.customer.address}
                                    </Text>
                                )}
                                {invoice.customer?.vat_registered && invoice.customer?.vat_number && (
                                    <Text type="secondary" style={{ display: "block", lineHeight: 1.8 }}>
                                        VAT No: <Text strong>{invoice.customer.vat_number}</Text>
                                    </Text>
                                )}
                            </div>

                            {(settings?.bank_name || settings?.iban) && (
                                <div>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            letterSpacing: 1.2,
                                            textTransform: "uppercase",
                                            color: token.colorTextTertiary,
                                            display: "block",
                                            marginBottom: 10,
                                        }}
                                    >
                                        Payment Details
                                    </Text>
                                    {settings.bank_name && (
                                        <Text type="secondary" style={{ display: "block", lineHeight: 1.8 }}>
                                            Bank: <Text strong>{settings.bank_name}</Text>
                                        </Text>
                                    )}
                                    {settings.iban && (
                                        <Text type="secondary" style={{ display: "block", lineHeight: 1.8 }}>
                                            IBAN: <Text strong>{settings.iban}</Text>
                                        </Text>
                                    )}
                                    {settings.swift_code && (
                                        <Text type="secondary" style={{ display: "block", lineHeight: 1.8 }}>
                                            SWIFT: <Text strong>{settings.swift_code}</Text>
                                        </Text>
                                    )}
                                </div>
                            )}
                        </div>

                        <Table
                            rowKey="id"
                            pagination={false}
                            columns={columns}
                            dataSource={invoice.items}
                            style={{ marginBottom: 32 }}
                        />

                        {invoice.remarks && (
                            <div
                                className="remarks-box"
                                style={{
                                    background: token.colorFillAlter,
                                    borderRadius: token.borderRadius,
                                    padding: "12px 16px",
                                    marginBottom: 32,
                                }}
                            >
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    <Text strong>Remarks: </Text>
                                    {invoice.remarks}
                                </Text>
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <div style={{ width: 300 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px 0",
                                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text type="secondary">Total VAT</Text>
                                    <Text type="secondary">
                                        {currency}{Number(invoice.total_vat).toFixed(2)}
                                    </Text>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "10px 0",
                                    }}
                                >
                                    <Title level={5} style={{ margin: 0 }}>
                                        Total Amount
                                    </Title>
                                    <Title
                                        level={5}
                                        className="invoice-total"
                                        style={{ margin: 0, color: token.colorPrimary }}
                                    >
                                        {currency}{Number(invoice.total_amount).toFixed(2)}
                                    </Title>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div style={{ textAlign: "center" }}>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                Thank you for your business! Generated by {settings?.app_name}
                            </Text>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

