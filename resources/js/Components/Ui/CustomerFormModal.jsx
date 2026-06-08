import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import {
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Divider,
    Row,
    Col,
    InputNumber,
} from "antd";
import { UserPlus, UserCheck } from "lucide-react";
import dayjs from "dayjs";

const { TextArea } = Input;

const initialValues = {
    customer_type: "individual",
    name: "",
    phone: "",
    gender: null,
    email: "",
    birthdate: null,
    area_id: null,
    shipping_address: "",
    address: "",
    city: "",
    pin_code: "",
    state: "",
    country: "",
    landmark: "",
    credit_day: null,
    credit_amount: null,
};

export default function CustomerFormModal({
    open,
    onClose,
    customer = null,
    onSuccess = null,
    mode = "page",
    areas = [],
}) {
    const isEdit = !!customer;
    const [antForm] = Form.useForm();

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm(initialValues);

    useEffect(() => {
        if (open) {
            const values = {
                customer_type: customer?.customer_type ?? "individual",
                name: customer?.name ?? "",
                phone: customer?.phone ?? "",
                gender: customer?.gender ?? null,
                email: customer?.email ?? "",
                birthdate: customer?.birthdate
                    ? dayjs(customer.birthdate)
                    : null,
                area_id: customer?.area_id ?? null,
                shipping_address: customer?.shipping_address ?? "",
                address: customer?.address ?? "",
                city: customer?.city ?? "",
                pin_code: customer?.pin_code ?? "",
                state: customer?.state ?? "",
                country: customer?.country ?? "",
                landmark: customer?.landmark ?? "",
                credit_day: customer?.credit_day ?? null,
                credit_amount: customer?.credit_amount ?? null,
            };

            setData({
                ...values,
                birthdate: values.birthdate
                    ? values.birthdate.format("YYYY-MM-DD")
                    : null,
            });
            antForm.setFieldsValue(values);
            clearErrors();
        } else {
            reset();
            antForm.resetFields();
            clearErrors();
        }
    }, [open, customer]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            antForm.setFields(
                Object.entries(errors).map(([name, msg]) => ({
                    name,
                    errors: [msg],
                })),
            );
        }
    }, [errors]);

    const handleValuesChange = (changed) => {
        Object.entries(changed).forEach(([key, value]) => {
            if (key === "birthdate") {
                setData(key, value ? value.format("YYYY-MM-DD") : null);
            } else {
                setData(key, value);
            }
        });
    };

    const handleSubmit = async () => {
        try {
            await antForm.validateFields();
        } catch {
            return;
        }

        if (mode === "quick") {
            try {
                const res = await fetch("/admin/customers/quick", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content"),
                    },
                    body: JSON.stringify(data),
                });
                const json = await res.json();
                if (!res.ok) {
                    if (json.errors) {
                        antForm.setFields(
                            Object.entries(json.errors).map(
                                ([name, msgs]) => ({
                                    name,
                                    errors: Array.isArray(msgs)
                                        ? msgs
                                        : [msgs],
                                }),
                            ),
                        );
                    }
                    return;
                }
                onSuccess?.(json);
                onClose();
            } catch (err) {
                console.error("Quick store error:", err);
            }
            return;
        }

        const opts = {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess?.();
                onClose();
            },
        };

        if (isEdit) {
            put(`/admin/customers/${customer.id}`, opts);
        } else {
            post("/admin/customers", opts);
        }
    };

    const handleCancel = () => {
        if (!processing) onClose();
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            onOk={handleSubmit}
            okText={isEdit ? "Update Customer" : "Save Customer"}
            cancelText="Cancel"
            confirmLoading={processing}
            title={
                <div className="flex items-center gap-2">
                    {isEdit ? (
                        <UserCheck size={18} className="text-(--primary)" />
                    ) : (
                        <UserPlus size={18} className="text-(--primary)" />
                    )}
                    <span>{isEdit ? "Edit Customer" : "Add Customer"}</span>
                </div>
            }
            width={820}
            destroyOnHidden
            maskClosable={!processing}
        >
            <Divider className="my-3!" />

            <Form
                form={antForm}
                layout="vertical"
                onValuesChange={handleValuesChange}
                requiredMark="optional"
                size="middle"
                variant="filled"
            >
                <Row gutter={12}>
                    <Col xs={24} md={8}>
                        <Form.Item label="Customer Type" name="customer_type">
                            <Select
                                size="large"
                                options={[
                                    {
                                        value: "individual",
                                        label: "Individual",
                                    },
                                    { value: "company", label: "Company" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Full Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Full name is required",
                                },
                                {
                                    pattern: /^[a-zA-Z\s'-\.]+$/,
                                    message:
                                        "Name can only contain letters, spaces, apostrophes, dots and hyphens",
                                },
                                {
                                    min: 2,
                                    message:
                                        "Name must be at least 2 characters",
                                },
                            ]}
                        >
                            <Input
                                placeholder="e.g. John Smith"
                                autoComplete="off"
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Email is required",
                                },
                                {
                                    type: "email",
                                    message: "Enter a valid email address",
                                },
                            ]}
                        >
                            <Input
                                placeholder="john@example.com"
                                autoComplete="off"
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    pattern: /^[\d\s\+\-\(\)]+$/,
                                    message:
                                        "Digits, spaces, +, - and parentheses only",
                                },
                            ]}
                        >
                            <Input placeholder="+44 7700 000000" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Gender" name="gender">
                            <Select
                                allowClear
                                placeholder="Select gender"
                                options={[
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                    { value: "other", label: "Other" },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Birthdate" name="birthdate">
                            <DatePicker
                                className="w-full"
                                disabledDate={(date) =>
                                    date && date.isAfter(dayjs(), "day")
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={8}>
                        <Form.Item label="Area" name="area_id">
                            <Select
                                allowClear
                                showSearch
                                placeholder="Select area"
                                optionFilterProp="label"
                                options={areas.map((area) => ({
                                    value: area.id,
                                    label: area.name,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Credit Day" name="credit_day">
                            <InputNumber
                                min={0}
                                max={9999}
                                precision={0}
                                className="w-full"
                                placeholder="e.g. 30"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Credit Limit" name="credit_amount">
                            <InputNumber
                                min={0}
                                precision={2}
                                className="w-full"
                                placeholder="0.00"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Address" name="address">
                            <TextArea
                                rows={3}
                                maxLength={500}
                                showCount
                                placeholder="Billing or primary address"
                                className="resize-none"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Shipping Address"
                            name="shipping_address"
                        >
                            <TextArea
                                rows={3}
                                maxLength={500}
                                showCount
                                placeholder="Shipping address"
                                className="resize-none"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={8}>
                        <Form.Item label="City" name="city">
                            <Input placeholder="City" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Pin Code" name="pin_code">
                            <Input placeholder="Pin code" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="State" name="state">
                            <Input placeholder="State" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Country" name="country">
                            <Input placeholder="Country" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Landmark" name="landmark">
                            <Input placeholder="Nearby landmark" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}
