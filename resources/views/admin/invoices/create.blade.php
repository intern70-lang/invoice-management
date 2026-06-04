<x-app-layout title="Create Invoice">
    <x-invoice-form
        :customers="$customers"
        :products="$products"
        :store-route="route('admin.invoices.store')"
        :index-route="route('admin.invoices.index')"
        :customer-data-route="url('admin/customers/__ID__/data')"
        :quick-customer-route="route('admin.customers.quick')"
    />
</x-app-layout>
