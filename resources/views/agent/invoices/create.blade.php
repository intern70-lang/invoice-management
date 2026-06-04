<x-app-layout title="Create Invoice">
    <x-invoice-form
        :customers="$customers"
        :products="$products"
        :store-route="route('agent.invoices.store')"
        :index-route="route('agent.invoices.index')"
        :customer-data-route="url('agent/customers/__ID__/data')"
        :quick-customer-route="route('agent.customers.store')"
    />
</x-app-layout>
