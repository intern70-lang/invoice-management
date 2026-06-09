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
    Segmented,
} from "antd";
import { UserPlus, UserCheck } from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";

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
    vat_registered: false,
    vat_number: null,
};

export default function CustomerFormModal({
    open,
    onClose,
    customer = null,
    onSuccess = null,
    onDuplicateEmail = null,
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
                credit_day:
                    customer?.credit_day !== null &&
                        customer?.credit_day !== undefined
                        ? Number(customer.credit_day)
                        : null,
                credit_amount:
                    customer?.credit_amount !== null &&
                        customer?.credit_amount !== undefined
                        ? Number(customer.credit_amount)
                        : null,
                vat_registered: customer?.vat_registered ?? false,
                vat_number: customer?.vat_number ?? null,
            };

            setData({
                ...values,
                birthdate: values.birthdate
                    ? values.birthdate.format("YYYY-MM-DD")
                    : null,
                vat_registered: values.vat_registered,
                vat_number: values.vat_number,
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

        // if (mode === "quick") {
        //     try {
        //         const res = await fetch("/admin/customers", {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "X-CSRF-TOKEN": document
        //                     .querySelector('meta[name="csrf-token"]')
        //                     ?.getAttribute("content"),
        //             },
        //             body: JSON.stringify(data),
        //         });
        //         const json = await res.json();
        //         if (!res.ok) {
        //             if (json.errors) {
        //                 antForm.setFields(
        //                     Object.entries(json.errors).map(
        //                         ([name, msgs]) => ({
        //                             name,
        //                             errors: Array.isArray(msgs)
        //                                 ? msgs
        //                                 : [msgs],
        //                         }),
        //                     ),
        //                 );
        //             }
        //             return;
        //         }
        //         onSuccess?.(json);
        //         onClose();
        //     } catch (err) {
        //         console.error("Quick store error:", err);
        //     }
        //     return;
        // }

        if (mode === "quick") {
            try {
                const { data: json } = await axios.post("/admin/customers", data);
                onSuccess?.(json);
                onClose();
                // } catch (err) {
                //     if (err.response?.status === 422 && err.response.data?.errors) {
                //         antForm.setFields(
                //             Object.entries(err.response.data.errors).map(([name, msgs]) => ({
                //                 name,
                //                 errors: Array.isArray(msgs) ? msgs : [msgs],
                //             })),
                //         );
                //     } else {
                //         console.error("Quick store error:", err);
                //     }
                // }
            } catch (err) {
                if (err.response?.status === 422 && err.response.data?.errors) {
                    const errs = err.response.data.errors;

                    // ✅ Duplicate email in quick mode — auto-select existing customer
                    if (errs.email && mode === "quick" && onDuplicateEmail) {
                        const emailValue = data.email;
                        onDuplicateEmail(emailValue);
                        return;
                    }

                    antForm.setFields(
                        Object.entries(errs).map(([name, msgs]) => ({
                            name,
                            errors: Array.isArray(msgs) ? msgs : [msgs],
                        })),
                    );
                } else {
                    console.error("Quick store error:", err);
                }
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
                                    pattern: /^[A-Za-z\s.,]+$/,
                                    message:
                                        "Name can only contain letters, spaces, dots (.) and commas (,)",
                                },
                                {
                                    min: 2,
                                    message: "Name must be at least 2 characters",
                                },
                                {
                                    max: 100,
                                    message: "Name cannot exceed 100 characters",
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
                                {
                                    max: 255,
                                    message: "Email cannot exceed 255 characters",
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
                                    pattern: /^(?:\+92|92|0)?3\d{9}$/,
                                    message:
                                        "Enter a valid mobile number (03XXXXXXXXX)",
                                },
                            ]}
                        >
                            <Input placeholder="+92 7700 000000" />
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
                        <Form.Item label="Credit Day" name="credit_day"
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    max: 365,
                                    message: "Credit day must be between 0 and 365",
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                max={9999}
                                precision={0}
                                className="w-full!"
                                placeholder="e.g. 30"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Credit Limit" name="credit_amount"
                            rules={[
                                {
                                    type: "number",
                                    min: 0,
                                    message: "Credit limit cannot be negative",
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                precision={2}
                                className="w-full!"
                                placeholder="0.00"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Address" name="address"
                            rules={[
                                {
                                    min: 5,
                                    message: "Address is too short",
                                },
                                {
                                    max: 500,
                                    message: "Address cannot exceed 500 characters",
                                },
                            ]}
                        >
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
                            rules={[
                                {
                                    max: 500,
                                    message: "Shipping address cannot exceed 500 characters",
                                },
                            ]}
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
                        <Form.Item label="City" name="city"
                            rules={[
                                {
                                    pattern: /^[A-Za-z\s.,]+$/,
                                    message:
                                        "City can only contain letters, spaces, dots and commas",
                                },
                                {
                                    max: 100,
                                    message: "City cannot exceed 100 characters",
                                },
                            ]}
                        >
                            <Input placeholder="City" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Pin / Zip Code" name="pin_code"
                            rules={[
                                {
                                    pattern: /^\d{5}$/,
                                    message: "Pin code must be exactly 5 digits",
                                },
                            ]}
                        >
                            <Input placeholder="Pin code" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[
                                {
                                    pattern: /^[A-Za-z\s.,]+$/,
                                    message:
                                        "State can only contain letters, spaces, dots and commas",
                                },
                                {
                                    max: 100,
                                    message: "State cannot exceed 100 characters",
                                },
                            ]}
                        >
                            <Input placeholder="State" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Country" name="country"
                            rules={[
                                {
                                    pattern: /^[A-Za-z\s.,]+$/,
                                    message:
                                        "Country can only contain letters, spaces, dots and commas",
                                },
                                {
                                    max: 100,
                                    message: "Country cannot exceed 100 characters",
                                },
                            ]}
                        >
                            <Input placeholder="Country" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Landmark" name="landmark"
                            rules={[
                                {
                                    pattern: /^[A-Za-z0-9\s.,-]+$/,
                                    message:
                                        "Landmark contains invalid characters",
                                },
                                {
                                    max: 200,
                                    message: "Landmark cannot exceed 200 characters",
                                },
                            ]}
                        >
                            <Input placeholder="Nearby landmark" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col xs={24} md={5}>
                        <Form.Item label="VAT Registered" name="vat_registered">
                            <Segmented
                                block
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Form.Item noStyle shouldUpdate={(prev, curr) => prev.vat_registered !== curr.vat_registered}>
                        {({ getFieldValue }) =>
                            getFieldValue("vat_registered") === true ? (
                                <Col xs={24} md={19}>
                                    <Form.Item
                                        label="VAT Number"
                                        name="vat_number"
                                        rules={[
                                            { required: true, message: "VAT number is required" },
                                            { max: 50, message: "VAT number cannot exceed 50 characters" },
                                            { pattern: /^[A-Za-z0-9\-]+$/, message: "Only letters, numbers and hyphens allowed" },
                                        ]}
                                    >
                                        <Input autoComplete="off" placeholder="e.g. PK1234567" />
                                    </Form.Item>
                                </Col>
                            ) : null
                        }
                    </Form.Item>
                </Row>
            </Form>
        </Modal>
    );
}
