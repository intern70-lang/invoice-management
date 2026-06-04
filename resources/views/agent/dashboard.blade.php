<x-app-layout title="Dashboard">
    <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="card p-4">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <div>
                    <p class="text-xs text-slate-500">My Invoices</p>
                    <p class="text-lg font-semibold text-white">{{ $stats['invoices'] }}</p>
                </div>
            </div>
        </div>
        <div class="card p-4">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                    <p class="text-xs text-slate-500">My Revenue</p>
                    <p class="text-lg font-semibold text-white">£{{ number_format($stats['revenue'], 2) }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="flex items-center justify-between px-5 py-4 border-b border-surface-700">
            <h2 class="text-sm font-semibold text-white">Recent Invoices</h2>
            <a href="{{ route('agent.invoices.index') }}" class="text-xs text-blue-400 hover:text-blue-300">View all</a>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-surface-700">
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Invoice #</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Customer</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Date</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($recentInvoices as $inv)
                    <tr class="table-row">
                        <td class="px-5 py-3 text-blue-400 font-medium">
                            <a href="{{ route('agent.invoices.show', $inv) }}">{{ $inv->invoice_number }}</a>
                        </td>
                        <td class="px-5 py-3 text-slate-300">{{ $inv->customer->name }}</td>
                        <td class="px-5 py-3 text-slate-400">{{ $inv->invoice_date->format('d M Y') }}</td>
                        <td class="px-5 py-3 text-right text-white font-medium">£{{ number_format($inv->total_amount, 2) }}</td>
                    </tr>
                    @empty
                    <tr><td colspan="4" class="px-5 py-8 text-center text-slate-500">No invoices yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-app-layout>
