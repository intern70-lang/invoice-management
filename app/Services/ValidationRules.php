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

    // ── Product ───────────────────────────────────────────────────────────────

    public static function product(): array
    {
        return [
            'name'           => ['required', 'string', 'regex:/^[a-zA-Z0-9\s\-\(\)]+$/', 'min:2', 'max:255'],
            'description'    => ['nullable', 'string', 'max:1000'],
            'category_id'    => ['nullable', 'integer', 'exists:categories,id'],
            'qty'            => ['required', 'integer', 'min:0', 'max:999999'],
            'purchase_price' => ['required', 'numeric', 'min:0', 'max:9999999', 'regex:/^\d+(\.\d{1,2})?$/'],
            'selling_price'  => ['required', 'numeric', 'min:0', 'max:9999999', 'regex:/^\d+(\.\d{1,2})?$/', 'gte:purchase_price'],
            'vat'            => ['required', 'integer', 'in:0,20'],
            'moq'            => ['required', 'integer', 'min:1', 'max:999999'],
        ];
    }

    public static function productMessages(): array
    {
        return [
            'name.required'           => 'Product name is required.',
            'name.regex'              => 'Product name may only contain letters, numbers, spaces, hyphens and parentheses.',
            'name.min'                => 'Product name must be at least 2 characters.',
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
            'name'          => ['required', 'string', 'regex:/^[a-zA-Z\s\-\'\.]+$/', 'min:2', 'max:255'],
            'email'         => ['nullable', 'email', 'max:255'],
            'phone'         => ['nullable', 'string', 'regex:/^[\d\s\+\-\(\)]+$/', 'min:7', 'max:30'],
            'customer_type' => ['required', 'in:regular,business'],
            'address'       => ['nullable', 'string', 'max:500'],
            'vat_number'    => ['nullable', 'string', 'regex:/^[a-zA-Z0-9]+$/', 'max:50'],
        ];
    }

    public static function customerMessages(): array
    {
        return [
            'name.required'    => 'Customer name is required.',
            'name.regex'       => 'Name may only contain letters, spaces, hyphens, apostrophes and dots.',
            'name.min'         => 'Name must be at least 2 characters.',
            'email.email'      => 'Please enter a valid email address.',
            'phone.regex'      => 'Phone may only contain digits, spaces, +, - and parentheses.',
            'phone.min'        => 'Phone number seems too short.',
            'vat_number.regex' => 'VAT number may only contain letters and numbers.',
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
            'items.*.vat_percent'       => ['required', 'integer', 'in:0,20'],
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
