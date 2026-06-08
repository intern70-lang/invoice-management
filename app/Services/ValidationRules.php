<?php

namespace App\Services;

/**
 * Central place for all validation rules.
 * Controllers and FormRequests both use this.
 */
class ValidationRules
{
    // ── Category ──────────────────────────────────────────────────────────────

    public static function category(): array
    {
        return [
            'name' => ['required', 'string', 'regex:/^[a-zA-Z0-9\s\-]+$/', 'min:2', 'max:100', 'unique:categories,name'],
        ];
    }

    public static function categoryMessages(): array
    {
        return [
            'name.required' => 'Category name is required.',
            'name.regex'    => 'Category name may only contain letters, numbers, spaces and hyphens.',
            'name.min'      => 'Category name must be at least 2 characters.',
            'name.max'      => 'Category name may not exceed 100 characters.',
        ];
    }

    // Area

    public static function area(?int $ignoreId = null): array
    {
        $uniqueRule = 'unique:areas,name';
        if ($ignoreId) {
            $uniqueRule .= ',' . $ignoreId;
        }

        return [
            'name' => ['required', 'string', 'regex:/^[a-zA-Z0-9\s\-]+$/', 'min:2', 'max:100', $uniqueRule],
        ];
    }

    public static function areaMessages(): array
    {
        return [
            'name.required' => 'Area name is required.',
            'name.regex'    => 'Area name may only contain letters, numbers, spaces and hyphens.',
            'name.min'      => 'Area name must be at least 2 characters.',
            'name.max'      => 'Area name may not exceed 100 characters.',
        ];
    }

    // Manufacturer

    public static function manufacturer(?int $ignoreId = null): array
    {
        $uniqueRule = 'unique:manufacturers,name';
        if ($ignoreId) {
            $uniqueRule .= ',' . $ignoreId;
        }

        return [
            'name'    => ['required', 'string', 'regex:/^[a-zA-Z0-9\s\-]+$/', 'min:2', 'max:100', $uniqueRule],
            'number'  => ['nullable', 'string', 'regex:/^[\d\s\+\-\(\)]+$/', 'max:30'],
            'email'   => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
        ];
    }

    public static function manufacturerMessages(): array
    {
        return [
            'name.required' => 'Manufacturer name is required.',
            'name.regex'    => 'Manufacturer name may only contain letters, numbers, spaces and hyphens.',
            'name.min'      => 'Manufacturer name must be at least 2 characters.',
            'name.max'      => 'Manufacturer name may not exceed 100 characters.',
            'number.regex'  => 'Number may only contain digits, spaces, +, - and parentheses.',
            'email.email'   => 'Please enter a valid email address.',
        ];
    }

    // Vendor

    public static function vendor(?int $ignoreId = null): array
    {
        $uniqueRule = 'unique:vendors,name';
        if ($ignoreId) {
            $uniqueRule .= ',' . $ignoreId;
        }

        return [
            'name'           => ['required', 'string', 'regex:/^[a-zA-Z0-9\s\-]+$/', 'min:2', 'max:100', $uniqueRule],
            'company'        => ['nullable', 'string', 'max:255'],
            'phone'          => ['nullable', 'string', 'regex:/^[\d\s\+\-\(\)]+$/', 'max:30'],
            'email'          => ['nullable', 'email', 'max:255'],
            'tax_reg_number' => ['nullable', 'string', 'regex:/^[a-zA-Z0-9\-\s]+$/', 'max:100'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city'           => ['nullable', 'string', 'max:100'],
            'pincode'        => ['nullable', 'string', 'max:20'],
            'state'          => ['nullable', 'string', 'max:100'],
            'country'        => ['nullable', 'string', 'max:100'],
        ];
    }

    public static function vendorMessages(): array
    {
        return [
            'name.required'        => 'Vendor name is required.',
            'name.regex'           => 'Vendor name may only contain letters, numbers, spaces and hyphens.',
            'name.min'             => 'Vendor name must be at least 2 characters.',
            'name.max'             => 'Vendor name may not exceed 100 characters.',
            'phone.regex'          => 'Phone may only contain digits, spaces, +, - and parentheses.',
            'email.email'          => 'Please enter a valid email address.',
            'tax_reg_number.regex' => 'Tax registration number may only contain letters, numbers, spaces and hyphens.',
        ];
    }

    // ── Product ───────────────────────────────────────────────────────────────

    public static function product(?int $ignoreId = null): array
    {
        $itemCodeUniqueRule = 'unique:products,item_code';
        if ($ignoreId) {
            $itemCodeUniqueRule .= ',' . $ignoreId;
        }

        return [
            'image'                  => ['nullable', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'name'                   => ['required', 'string', 'regex:/^[a-zA-Z0-9\s\-\(\)]+$/', 'min:2', 'max:255'],
            'item_code'              => ['required', 'string', 'regex:/^[a-zA-Z0-9\-\_\/]+$/', 'max:100', $itemCodeUniqueRule],
            'description'            => ['nullable', 'string', 'max:1000'],
            'category_id'            => ['required', 'integer', 'exists:categories,id'],
            'manufacturer_id'        => ['required', 'integer', 'exists:manufacturers,id'],
            'item_class'             => ['required', 'in:general,sale_only,raw_material'],
            'hsn_code'               => ['nullable', 'string', 'regex:/^[a-zA-Z0-9\-\s]+$/', 'max:50'],
            'regional_name'          => ['nullable', 'string', 'max:255'],
            'unit'                   => ['required', 'string', 'max:50'],
            'qty'                    => ['required', 'integer', 'min:0', 'max:999999'],
            'purchase_price'         => ['required', 'numeric', 'min:0', 'max:9999999', 'regex:/^\d+(\.\d{1,2})?$/'],
            'purchase_tax_inclusive' => ['boolean'],
            'selling_price'          => ['required', 'numeric', 'min:0', 'max:9999999', 'regex:/^\d+(\.\d{1,2})?$/', 'gte:purchase_price'],
            'vat'                    => ['required', 'numeric', 'min:0', 'max:100'],
            'sale_tax_inclusive'     => ['boolean'],
            'discount_percent'       => ['nullable', 'numeric', 'min:0', 'max:100'],
            'cess_percent'           => ['nullable', 'numeric', 'min:0', 'max:100'],
            'additional_cess'        => ['nullable', 'numeric', 'min:0', 'max:9999999'],
            'is_weighing_item'       => ['boolean'],
            'moq'                    => ['required', 'integer', 'min:1', 'max:999999'],
        ];
    }

    public static function productMessages(): array
    {
        return [
            'name.required'           => 'Product name is required.',
            'name.regex'              => 'Product name may only contain letters, numbers, spaces, hyphens and parentheses.',
            'name.min'                => 'Product name must be at least 2 characters.',
            'item_code.required'      => 'Item code is required.',
            'item_code.regex'         => 'Item code may only contain letters, numbers, hyphens, underscores and slashes.',
            'item_code.unique'        => 'This item code is already used.',
            'image.uploaded'          => 'Product image could not be uploaded. Please choose a valid image under 5 MB.',
            'image.image'             => 'Please upload a valid image file.',
            'image.mimes'             => 'Product image must be a PNG, JPG, JPEG or WEBP file.',
            'image.max'               => 'Product image may not be larger than 5 MB.',
            'category_id.required'    => 'Category is required.',
            'manufacturer_id.required' => 'Manufacturer is required.',
            'item_class.required'     => 'Item class is required.',
            'hsn_code.regex'          => 'HSN code may only contain letters, numbers, spaces and hyphens.',
            'unit.required'           => 'Unit is required.',
            'qty.required'            => 'Quantity is required.',
            'qty.integer'             => 'Quantity must be a whole number.',
            'qty.min'                 => 'Quantity cannot be negative.',
            'purchase_price.required' => 'Purchase price is required.',
            'purchase_price.numeric'  => 'Purchase price must be a number.',
            'purchase_price.regex'    => 'Purchase price may have at most 2 decimal places.',
            'selling_price.required'  => 'Selling price is required.',
            'selling_price.numeric'   => 'Selling price must be a number.',
            'selling_price.regex'     => 'Selling price may have at most 2 decimal places.',
            'vat.required'            => 'VAT rate is required.',
            'vat.in'                  => 'VAT must be 0% or 20%.',
            'moq.required'            => 'MOQ is required.',
            'moq.integer'             => 'MOQ must be a whole number.',
            'moq.min'                 => 'MOQ must be at least 1.',
        ];
    }

    // ── Customer ──────────────────────────────────────────────────────────────

    public static function customer(): array
    {
        return [
            'customer_type'    => ['nullable', 'in:individual,company'],
            'name'             => ['required', 'string', 'regex:/^[a-zA-Z\s\-\'\.]+$/', 'min:2', 'max:255'],
            'phone'            => ['nullable', 'string', 'regex:/^[\d\s\+\-\(\)]+$/', 'max:30'],
            'gender'           => ['nullable', 'in:male,female,other'],
            'email'            => ['required', 'email', 'max:255'],
            'birthdate'        => ['nullable', 'date', 'before_or_equal:today'],
            'area_id'          => ['nullable', 'integer', 'exists:areas,id'],
            'shipping_address' => ['nullable', 'string', 'max:500'],
            'address'          => ['nullable', 'string', 'max:500'],
            'city'             => ['nullable', 'string', 'max:100'],
            'pin_code'         => ['nullable', 'string', 'max:20'],
            'state'            => ['nullable', 'string', 'max:100'],
            'country'          => ['nullable', 'string', 'max:100'],
            'landmark'         => ['nullable', 'string', 'max:255'],
            'credit_day'       => ['nullable', 'integer', 'min:0', 'max:9999'],
            'credit_amount'    => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
        ];
    }

    public static function customerMessages(): array
    {
        return [
            'name.required'    => 'Customer name is required.',
            'name.regex'       => 'Name may only contain letters, spaces, hyphens, apostrophes and dots.',
            'name.min'         => 'Name must be at least 2 characters.',
            'email.required'   => 'Email is required.',
            'email.email'      => 'Please enter a valid email address.',
            'phone.regex'      => 'Phone may only contain digits, spaces, +, - and parentheses.',
            'birthdate.before_or_equal' => 'Birthdate cannot be in the future.',
            'area_id.exists'   => 'Selected area is invalid.',
        ];
    }

    // ── Invoice ───────────────────────────────────────────────────────────────

    public static function invoice(): array
    {
        return [
            'customer_id'               => ['required', 'integer', 'exists:customers,id'],
            'invoice_date'              => ['required', 'date', 'before_or_equal:today'],
            'due_date'                  => ['nullable', 'date', 'after_or_equal:invoice_date'],
            'remarks'                   => ['nullable', 'string', 'max:1000'],
            'items'                     => ['required', 'array', 'min:1'],
            'items.*.product_id'        => ['required', 'integer', 'exists:products,id'],
            'items.*.selling_price'     => ['required', 'numeric', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'items.*.vat_percent'       => ['required', 'numeric', 'min:0', 'max:100'],
            'items.*.qty'               => ['required', 'integer', 'min:1', 'max:99999'],
        ];
    }

    public static function invoiceMessages(): array
    {
        return [
            'customer_id.required'           => 'Please select a customer.',
            'customer_id.exists'             => 'Selected customer is invalid.',
            'invoice_date.required'          => 'Invoice date is required.',
            'invoice_date.before_or_equal'   => 'Invoice date cannot be in the future.',
            'due_date.after_or_equal'        => 'Due date must be on or after the invoice date.',
            'items.required'                 => 'Please add at least one product.',
            'items.min'                      => 'Please add at least one product.',
            'items.*.product_id.required'    => 'Please select a product for each row.',
            'items.*.selling_price.required' => 'Selling price is required.',
            'items.*.selling_price.numeric'  => 'Selling price must be a number.',
            'items.*.selling_price.regex'    => 'Price may have at most 2 decimal places.',
            'items.*.qty.required'           => 'Quantity is required.',
            'items.*.qty.integer'            => 'Quantity must be a whole number.',
            'items.*.qty.min'                => 'Quantity must be at least 1.',
        ];
    }

    // ── Settings ──────────────────────────────────────────────────────────────

    public static function settings(): array
    {
        return [
            'app_name'   => ['required', 'string', 'max:100'],
            'address'    => ['nullable', 'string', 'max:500'],
            'phone'      => ['nullable', 'string', 'regex:/^[\d\s\+\-\(\)]+$/', 'max:30'],
            'email'      => ['nullable', 'email', 'max:255'],
            'bank_name'  => ['nullable', 'string', 'max:255'],
            'iban'       => ['nullable', 'string', 'regex:/^[A-Z0-9]+$/', 'max:34'],
            'swift_code' => ['nullable', 'string', 'regex:/^[A-Z0-9]+$/', 'max:11'],
            'logo'       => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'theme_mode' => ['required', 'in:dark,light'],
            'primary_color' => ['required', 'string'],
            'secondary_color' => ['required', 'string'],
            'currency_code' => ['required', 'string'],
            'currency_symbol' => ['required', 'string'],
        ];
    }

    public static function settingsMessages(): array
    {
        return [
            'app_name.required' => 'Application name is required.',
            'phone.regex'       => 'Phone may only contain digits, spaces, +, - and parentheses.',
            'email.email'       => 'Please enter a valid email address.',
            'iban.regex'        => 'IBAN may only contain uppercase letters and numbers.',
            'swift_code.regex'  => 'SWIFT code may only contain uppercase letters and numbers.',
        ];
    }
}
