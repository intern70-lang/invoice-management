// resources/js/Pages/Admin/CreateInvoice.jsx

import { useState, useCallback } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Typography,
    Divider,
    Tooltip,
} from "antd";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import dayjs from "dayjs";

import AppLayout from "@/Layouts/AppLayout";
import CustomerFormModal from "@/Components/Ui/CustomerFormModal";

const { Text } = Typography;
const { TextArea } = Input;

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (symbol, n) => `${symbol}${parseFloat(n || 0).toFixed(2)}`;

const calcRow = (price, qty, vatPct) => {
    const p = parseFloat(price) || 0;
    const q = parseInt(qty) || 0;
    const v = parseInt(vatPct) || 0;
    const vatAmt = p * q * (v / 100);
    return {
        vatAmt: parseFloat(vatAmt.toFixed(2)),
        lineTotal: parseFloat((p * q + vatAmt).toFixed(2)),
    };
};

// ── component ────────────────────────────────────────────────────────────────
export default function CreateInvoice({ customers, products, settings }) {
    const currency = settings?.currency_symbol ?? "£";

    const [form] = Form.useForm();

    // Customer quick-add modal
    const [quickOpen, setQuickOpen] = useState(false);

    // Customer list (may grow after quick-add)
    const [customerList, setCustomerList] = useState(customers);

    // Selected customer info panel
    const [customerInfo, setCustomerInfo] = useState(null);

    // Invoice line items
    const makeRow = () => ({
        _key: Date.now() + Math.random(),
        product_id: null,
        selling_price: 0,
        vat_percent: 0,
        qty: 1,
        vatAmt: 0,
        lineTotal: 0,
    });
    const [rows, setRows] = useState([makeRow()]); // one row pre-added

    // Submission state
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // ── customer info fetch ──────────────────────────────────────────────────
    const loadCustomerInfo = async (id) => {
        if (!id) {
            setCustomerInfo(null);
            return;
        }
        try {
            const res = await fetch(`/admin/customers/${id}/data`);
            const json = await res.json();
            setCustomerInfo(json);
        } catch {
            setCustomerInfo(null);
        }
    };

    // ── quick-add success ────────────────────────────────────────────────────
    const handleQuickSuccess = (newCustomer) => {
        setCustomerList((prev) => [...prev, newCustomer]);
        form.setFieldValue("customer_id", newCustomer.id);
        loadCustomerInfo(newCustomer.id);
        setQuickOpen(false);
    };

    // ── row helpers ──────────────────────────────────────────────────────────
    const addRow = () => setRows((prev) => [...prev, makeRow()]);

    const removeRow = (key) =>
        setRows((prev) => prev.filter((r) => r._key !== key));

    const updateRow = (key, patch) => {
        setRows((prev) =>
            prev.map((r) => {
                if (r._key !== key) return r;
                const updated = { ...r, ...patch };
                const { vatAmt, lineTotal } = calcRow(
                    updated.selling_price,
                    updated.qty,
                    updated.vat_percent,
                );
                return { ...updated, vatAmt, lineTotal };
            }),
        );
    };

    const onProductChange = (key, productId) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;
        updateRow(key, {
            product_id: productId,
            selling_price: product.selling_price,
            vat_percent: product.vat,
            qty: product.moq ?? 1,
        });
    };

    // ── totals ───────────────────────────────────────────────────────────────
    const totalVat = rows.reduce((s, r) => s + r.vatAmt, 0);
    const totalAmount = rows.reduce((s, r) => s + r.lineTotal, 0);

    // ── submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        // 1. Ant Design validation
        try {
            await form.validateFields();
        } catch {
            return;
        }

        // 2. Rows validation
        if (rows.length === 0) {
            setErrors({ items: "Please add at least one product." });
            return;
        }
        const invalidRow = rows.find(
            (r) => !r.product_id || r.qty < 1 || r.selling_price < 0,
        );
        if (invalidRow) {
            setErrors({
                items: "Please select a product and enter valid qty/price for all rows.",
            });
            return;
        }
        setErrors({});

        const values = form.getFieldsValue();

        const payload = {
            customer_id: values.customer_id,
            invoice_date: values.invoice_date
                ? dayjs(values.invoice_date).format("YYYY-MM-DD")
                : null,
            due_date: values.due_date
                ? dayjs(values.due_date).format("YYYY-MM-DD")
                : null,
            remarks: values.remarks ?? "",
            items: rows.map((r) => ({
                product_id: r.product_id,
                selling_price: r.selling_price,
                vat_percent: r.vat_percent,
                qty: r.qty,
            })),
        };

        setSubmitting(true);

        router.post("/admin/invoices", payload, {
            preserveScroll: true,
            onError: (errs) => {
                setSubmitting(false);
                // Map top-level errors back to form
                const fieldErrors = Object.entries(errs).map(([name, msg]) => ({
                    name,
                    errors: [msg],
                }));
                form.setFields(fieldErrors);
                // Surface items error if present
                if (errs.items) setErrors({ items: errs.items });
            },
            onSuccess: () => setSubmitting(false),
        });
    };

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <>
            <Head title="Create Invoice" />

            <AppLayout title="Create Invoice">
                {/* Back + title */}
                <div className="max-w-5xl mx-auto flex items-center gap-3   mb-4">
                    <Link href="/admin/invoices">
                        <Button
                            icon={<ArrowLeft size={15} />}
                            size="small"
                            color="default"
                            variant="filled"
                        />
                    </Link>
                    <h2 className="text-sm font-semibold text-(--text-primary) m-0!">
                        New Invoice
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto space-y-5 bg-(--bg-secondary) p-3 rounded-2xl border border-(--border-color)">
                    <Form
                        form={form}
                        layout="vertical"
                        requiredMark="optional"
                        size="middle"
                        variant="filled"
                        initialValues={{
                            invoice_date: dayjs(),
                            vat_percent: 0,
                        }}
                    >
                        {/* ── Top card: dates, customer, remarks ── */}
                        <div className="card p-5 mb-4 space-y-4">
                            {/* Dates + Customer row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Invoice Date */}
                                <Form.Item
                                    label="Invoice Date"
                                    name="invoice_date"
                                    className="m-0!"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Invoice date is required",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        className="w-full"
                                        size="large"
                                        disabledDate={(d) =>
                                            d && d.isAfter(dayjs(), "day")
                                        }
                                        onChange={() => {
                                            // Clear due date if it's now before invoice date
                                            const due =
                                                form.getFieldValue("due_date");
                                            const inv =
                                                form.getFieldValue(
                                                    "invoice_date",
                                                );
                                            if (
                                                due &&
                                                inv &&
                                                due.isBefore(inv, "day")
                                            ) {
                                                form.setFieldValue(
                                                    "due_date",
                                                    null,
                                                );
                                            }
                                        }}
                                    />
                                </Form.Item>

                                {/* Due Date */}
                                <Form.Item
                                    label="Due Date"
                                    name="due_date"
                                    className="m-0!"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Due date is required",
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const inv =
                                                    getFieldValue(
                                                        "invoice_date",
                                                    );
                                                if (!value || !inv)
                                                    return Promise.resolve();
                                                if (
                                                    value.isBefore(inv, "day")
                                                ) {
                                                    return Promise.reject(
                                                        "Due date must be on or after invoice date",
                                                    );
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <DatePicker
                                        className="w-full"
                                        size="large"
                                        disabledDate={(d) => {
                                            const inv =
                                                form.getFieldValue(
                                                    "invoice_date",
                                                );
                                            return inv
                                                ? d && d.isBefore(inv, "day")
                                                : false;
                                        }}
                                    />
                                </Form.Item>

                                <div>
                                    {/* Customer */}
                                    <div className="flex items-center justify-between mb-1.5 w-full!">
                                        <span>Customer</span>
                                        <Button
                                            type="link"
                                            size="small"
                                            icon={<Plus size={13} />}
                                            className="p-0 h-auto text-xs"
                                            onClick={() => setQuickOpen(true)}
                                        >
                                            New Customer
                                        </Button>
                                    </div>
                                    <Form.Item
                                        name="customer_id"
                                        className="m-0!"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select a customer",
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            size="large"
                                            placeholder="Select Customer"
                                            optionFilterProp="label"
                                            options={customerList.map((c) => ({
                                                value: c.id,
                                                label: c.name,
                                            }))}
                                            onChange={loadCustomerInfo}
                                            allowClear
                                            onClear={() =>
                                                setCustomerInfo(null)
                                            }
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            {/* Customer info panel */}
                            {customerInfo && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-(--surface-2) rounded-lg">
                                    {[
                                        {
                                            label: "Name",
                                            value: customerInfo.name,
                                        },
                                        {
                                            label: "Email",
                                            value: customerInfo.email,
                                        },
                                        {
                                            label: "Phone",
                                            value: customerInfo.phone,
                                        },
                                        {
                                            label: "VAT Number",
                                            value: customerInfo.vat_registered
                                                ? customerInfo.vat_number || "—"
                                                : "Not registered",
                                        },
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <p className="text-xs text-(--text-secondary) m-0!">
                                                {label}
                                            </p>
                                            <p className="text-sm text-(--text-primary) mt-0.5 m-0! truncate">
                                                {value || "—"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Remarks */}
                            <Form.Item
                                label="Remarks / Notes"
                                name="remarks"
                                className="m-0!"
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Add payment terms, banking details or notes..."
                                    className="resize-none text-sm"
                                />
                            </Form.Item>

                            <Divider className="my-4!" />

                            {/* ── Line items ── */}
                            <div className="flex items-center justify-between mb-3">
                                <Text strong className="text-sm">
                                    Invoice Items
                                </Text>
                                <Button
                                    icon={<Plus size={14} />}
                                    size="small"
                                    onClick={addRow}
                                >
                                    Add Product
                                </Button>
                            </div>

                            {/* Items error */}
                            {errors.items && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.items}
                                </p>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-400/30">
                                            {[
                                                {
                                                    label: "Product",
                                                    align: "left",
                                                },
                                                {
                                                    label: `Price (ex. VAT)`,
                                                    align: "right",
                                                },
                                                {
                                                    label: "VAT %",
                                                    align: "center",
                                                },
                                                {
                                                    label: "Qty",
                                                    align: "right",
                                                },
                                                {
                                                    label: "VAT Amt",
                                                    align: "right",
                                                },
                                                {
                                                    label: "Total",
                                                    align: "right",
                                                },
                                                { label: "", align: "right" },
                                            ].map((h, i) => (
                                                <th
                                                    key={i}
                                                    className={`text-${h.align} text-xs text-(--text-secondary) font-medium pb-3 px-2`}
                                                >
                                                    {h.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row) => (
                                            <tr
                                                key={row._key}
                                                className="border-b border-gray-400/30"
                                            >
                                                {/* Product */}
                                                <td className="py-2 pr-2 min-w-[180px]">
                                                    <Select
                                                        showSearch
                                                        size="middle"
                                                        placeholder="Select"
                                                        optionFilterProp="label"
                                                        value={row.product_id}
                                                        options={products.map(
                                                            (p) => ({
                                                                value: p.id,
                                                                label: p.name,
                                                            }),
                                                        )}
                                                        onChange={(val) =>
                                                            onProductChange(
                                                                row._key,
                                                                val,
                                                            )
                                                        }
                                                        className="w-full"
                                                        status={
                                                            errors.items &&
                                                            !row.product_id
                                                                ? "error"
                                                                : undefined
                                                        }
                                                    />
                                                </td>

                                                {/* Price */}
                                                <td className="py-2 px-2 w-32">
                                                    <InputNumber
                                                        size="middle"
                                                        min={0}
                                                        step={0.01}
                                                        precision={2}
                                                        prefix={currency}
                                                        value={
                                                            row.selling_price
                                                        }
                                                        onChange={(val) =>
                                                            updateRow(
                                                                row._key,
                                                                {
                                                                    selling_price:
                                                                        val ??
                                                                        0,
                                                                },
                                                            )
                                                        }
                                                        className="w-full"
                                                    />
                                                </td>

                                                {/* VAT % */}
                                                <td className="py-2 px-2 w-24">
                                                    <Select
                                                        size="middle"
                                                        value={row.vat_percent}
                                                        options={[
                                                            {
                                                                value: 0,
                                                                label: "0%",
                                                            },
                                                            {
                                                                value: 20,
                                                                label: "20%",
                                                            },
                                                        ]}
                                                        onChange={(val) =>
                                                            updateRow(
                                                                row._key,
                                                                {
                                                                    vat_percent:
                                                                        val,
                                                                },
                                                            )
                                                        }
                                                        className="w-full"
                                                    />
                                                </td>

                                                {/* Qty */}
                                                <td className="py-2 px-2 w-20">
                                                    <InputNumber
                                                        size="middle"
                                                        min={
                                                            products.find(
                                                                (p) =>
                                                                    p.id ===
                                                                    row.product_id,
                                                            )?.moq ?? 1
                                                        }
                                                        precision={0}
                                                        value={row.qty}
                                                        onChange={(val) =>
                                                            updateRow(
                                                                row._key,
                                                                {
                                                                    qty:
                                                                        val ??
                                                                        1,
                                                                },
                                                            )
                                                        }
                                                        className="w-full"
                                                        status={
                                                            errors.items &&
                                                            row.qty < 1
                                                                ? "error"
                                                                : undefined
                                                        }
                                                    />
                                                </td>

                                                {/* VAT Amt */}
                                                <td className="py-2 px-2 text-right text-(--text-secondary) whitespace-nowrap">
                                                    {fmt(currency, row.vatAmt)}
                                                </td>

                                                {/* Line total */}
                                                <td className="py-2 px-2 text-right font-medium text-(--text-primary) whitespace-nowrap">
                                                    {fmt(
                                                        currency,
                                                        row.lineTotal,
                                                    )}
                                                </td>

                                                {/* Remove */}
                                                <td className="py-2 pl-2 w-8">
                                                    <Tooltip title="Remove row">
                                                        <Button
                                                            size="small"
                                                            danger
                                                            type="text"
                                                            icon={
                                                                <Trash2
                                                                    size={13}
                                                                />
                                                            }
                                                            onClick={() =>
                                                                removeRow(
                                                                    row._key,
                                                                )
                                                            }
                                                        />
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        ))}

                                        {rows.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="py-6 text-center text-(--text-secondary) text-xs"
                                                >
                                                    No items yet — click "Add
                                                    Product" to start.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end pt-4">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <Text type="secondary">
                                            Total VAT (exclusive)
                                        </Text>
                                        <Text>{fmt(currency, totalVat)}</Text>
                                    </div>
                                    <div className="flex justify-between text-sm font-semibold border-t border-gray-400/30 pt-2">
                                        <Text strong>Total Amount</Text>
                                        <Text
                                            strong
                                            className="text-(--primary)"
                                        >
                                            {fmt(currency, totalAmount)}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <Link href="/admin/invoices">
                                <Button>Cancel</Button>
                            </Link>
                            <Button
                                type="primary"
                                icon={<Save size={14} />}
                                loading={submitting}
                                onClick={handleSubmit}
                            >
                                Save Invoice
                            </Button>
                        </div>
                    </Form>
                </div>
            </AppLayout>

            {/* Quick-add customer modal (reuses existing component in "quick" mode) */}
            <CustomerFormModal
                open={quickOpen}
                onClose={() => setQuickOpen(false)}
                mode="quick"
                onSuccess={handleQuickSuccess}
            />
        </>
    );
}
