// resources/js/Pages/Admin/Dashboard.jsx

import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Card, Row, Col, Statistic, Table, Typography, Button } from "antd";
import {
    FileText,
    Users,
    Package,
    Tags,
    PoundSterling,
    ArrowRight,
} from "lucide-react";
import CustomTable from "../../Components/Ui/CustomTable";

const { Title, Text } = Typography;

export default function Dashboard({ stats, recentInvoices }) {
    const cards = [
        {
            label: "Total Invoices",
            value: stats.invoices,
            icon: <FileText size={24} className="text-blue-500" />,
            bgColor: "bg-blue-500/10",
        },
        {
            label: "Customers",
            value: stats.customers,
            icon: <Users size={24} className="text-green-500" />,
            bgColor: "bg-green-500/10",
        },
        {
            label: "Products",
            value: stats.products,
            icon: <Package size={24} className="text-purple-500" />,
            bgColor: "bg-purple-500/10",
        },
        // {
        //     label: "Categories",
        //     value: stats.categories,
        //     icon: <Tags size={24} className="text-yellow-500" />,
        //     bgColor: "bg-yellow-500/10",
        // },
        {
            label: "Total Revenue",
            value: `£${Number(stats.revenue).toLocaleString()}`,
            icon: <PoundSterling size={24} className="text-emerald-500" />,
            bgColor: "bg-emerald-500/10",
        },
    ];

    const columns = [
        {
            title: "Invoice #",
            dataIndex: "invoice_number",
            key: "invoice_number",
            render: (text) => (
                <span className="text-blue-500 font-medium">{text}</span>
            ),
        },
        {
            title: "Customer",
            dataIndex: ["customer", "name"],
            key: "customer",
            render: (text) => <Text>{text}</Text>,
        },
        {
            title: "Date",
            dataIndex: "invoice_date",
            key: "date",
            render: (date) => (
                <Text type="secondary">
                    {new Date(date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </Text>
            ),
        },
        {
            title: "Amount",
            dataIndex: "total_amount",
            key: "amount",
            align: "right",
            render: (amount) => (
                <Text strong>
                    £
                    {Number(amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
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
                    {/* Stats */}
                    <Row gutter={[16, 16]}>
                        {cards.map((card, index) => (
                            <Col
                                xs={24}
                                sm={12}
                                lg={6}
                                key={index}
                                className="flex-1"
                            >
                                <Card
                                    bordered={false}
                                    className="h-full hover:shadow-lg transition-all duration-300"
                                    style={{
                                        background: "var(--bg-secondary)",
                                    }}
                                    bodyStyle={{ padding: "15px" }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bgColor}`}
                                        >
                                            {card.icon}
                                        </div>
                                        <div>
                                            <Text
                                                type="secondary"
                                                className="text-xs uppercase tracking-wider font-semibold"
                                            >
                                                {card.label}
                                            </Text>
                                            <Title
                                                level={3}
                                                style={{
                                                    margin: 0,
                                                    marginTop: 4,
                                                }}
                                            >
                                                {card.value}
                                            </Title>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Recent Invoices */}
                    <Card
                        bordered={false}
                        className="overflow-hidden mb-3! shadow-sm hover:shadow-md transition-all duration-300"
                        style={{ background: "var(--bg-secondary)" }}
                        bodyStyle={{ padding: 0 }}
                        title={
                            <Title level={5} style={{ margin: 0 }}>
                                Recent Invoices
                            </Title>
                        }
                        extra={
                            <Link href="/admin/invoices">
                                <Button
                                    type="link"
                                    className="flex items-center gap-1"
                                >
                                    View all <ArrowRight size={14} />
                                </Button>
                            </Link>
                        }
                    ></Card>

                    <CustomTable
                        columns={columns}
                        data={recentInvoices}
                        rowKey="id"
                        pagination={false}
                        className="w-full"
                    />
                </div>
            </AppLayout>
        </>
    );
}
