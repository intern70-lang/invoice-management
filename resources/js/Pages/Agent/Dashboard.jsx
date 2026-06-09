import { Head, Link } from "@inertiajs/react";
import { Card, Row, Col, Typography } from "antd";
import { FileText, PoundSterling, ArrowRight, LayoutDashboard } from "lucide-react";

import AppLayout from "@/Layouts/AppLayout";
import CustomTable from "@/Components/Ui/CustomTable";

const { Title, Text } = Typography;

export default function Dashboard({ stats, recentInvoices = [] }) {
    const cards = [
        {
            label: "My Invoices",
            value: stats?.invoices ?? 0,
            icon: <FileText size={24} className="text-blue-500" />,
            bgColor: "bg-blue-500/10",
        },
        {
            label: "My Revenue",
            value: `£${Number(stats?.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: <PoundSterling size={24} className="text-emerald-500" />,
            bgColor: "bg-emerald-500/10",
        },
    ];

    const columns = [
        {
            title: "Invoice #",
            dataIndex: "invoice_number",
            key: "invoice_number",
            render: (_, record) => (
                <Link href={`/agent/invoices/${record.id}`} className="text-blue-500 font-medium">
                    {record.invoice_number}
                </Link>
            ),
        },
        {
            title: "Customer",
            dataIndex: ["customer", "name"],
            key: "customer",
            render: (name) => <Text>{name ?? "—"}</Text>,
        },
        {
            title: "Date",
            dataIndex: "invoice_date",
            key: "invoice_date",
            render: (date) => (
                <Text type="secondary">
                    {date
                        ? new Date(date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                          })
                        : "—"}
                </Text>
            ),
        },
        {
            title: "Amount",
            dataIndex: "total_amount",
            key: "total_amount",
            align: "right",
            render: (amount) => (
                <Text strong>
                    £
                    {Number(amount ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </Text>
            ),
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <AppLayout title="Dashboard">
                <div className="space-y-6">
                    <Row gutter={[16, 16]}>
                        {cards.map((card, idx) => (
                            <Col xs={24} sm={12} key={idx} className="flex-1">
                                <Card
                                    bordered={false}
                                    className="h-full hover:shadow-lg transition-all duration-300"
                                    style={{ background: "var(--bg-secondary)" }}
                                    bodyStyle={{ padding: 15 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bgColor}`}>
                                            {card.icon}
                                        </div>
                                        <div>
                                            <Text type="secondary" className="text-xs uppercase tracking-wider font-semibold">
                                                {card.label}
                                            </Text>
                                            <Title level={3} style={{ margin: 0, marginTop: 4 }}>
                                                {card.value}
                                            </Title>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Card
                        bordered={false}
                        className="overflow-hidden mb-3! shadow-sm hover:shadow-md transition-all duration-300"
                        style={{ background: "var(--bg-secondary)" }}
                        bodyStyle={{ padding: 0 }}
                        title={<Title level={5} style={{ margin: 0 }}>Recent Invoices</Title>}
                        extra={
                            <Link href="/agent/invoices">
                                <span className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                                    View all <ArrowRight size={14} />
                                </span>
                            </Link>
                        }
                    >
                        <CustomTable
                            columns={columns}
                            data={recentInvoices}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}

