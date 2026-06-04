<x-app-layout title="Invoices">
    <div class="flex items-center justify-between mb-5">
        <div>
            <h2 class="text-base font-semibold text-white">Invoices</h2>
            <p class="text-xs text-slate-500 mt-0.5">All invoices in the system</p>
        </div>
        <a href="{{ route('admin.invoices.create') }}" class="btn btn-primary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            New Invoice
        </a>
    </div>

    <div class="card">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-surface-700">
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Invoice #</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Customer</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Date</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Created By</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">VAT</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">Total</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($invoices as $inv)
                    <tr class="table-row">
                        <td class="px-5 py-3 text-blue-400 font-medium">{{ $inv->invoice_number }}</td>
                        <td class="px-5 py-3 text-white">{{ $inv->customer->name }}</td>
                        <td class="px-5 py-3 text-slate-400">{{ $inv->invoice_date->format('d M Y') }}</td>
                        <td class="px-5 py-3 text-slate-400">{{ $inv->creator->name }}</td>
                        <td class="px-5 py-3 text-right text-slate-300">£{{ number_format($inv->total_vat, 2) }}</td>
                        <td class="px-5 py-3 text-right text-white font-semibold">£{{ number_format($inv->total_amount, 2) }}</td>
                        <td class="px-5 py-3">
                            <div class="flex items-center justify-end gap-2">
                                <a href="{{ route('admin.invoices.show', $inv) }}" class="btn btn-secondary text-xs py-1 px-2">View</a>
                                <form action="{{ route('admin.invoices.destroy', $inv) }}" method="POST" data-confirm="Delete this invoice?">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn btn-danger text-xs py-1 px-2">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="7" class="px-5 py-8 text-center text-slate-500">No invoices yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-app-layout>
