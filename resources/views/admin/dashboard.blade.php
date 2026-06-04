<x-app-layout title="Dashboard">
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        @php
            $cards = [
                ['label'=>'Total Invoices',  'value'=>$stats['invoices'],             'icon'=>'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', 'color'=>'text-blue-400'],
                ['label'=>'Customers',        'value'=>$stats['customers'],            'icon'=>'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', 'color'=>'text-green-400'],
                ['label'=>'Products',         'value'=>$stats['products'],             'icon'=>'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', 'color'=>'text-purple-400'],
                ['label'=>'Categories',       'value'=>$stats['categories'],           'icon'=>'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', 'color'=>'text-yellow-400'],
                ['label'=>'Total Revenue',    'value'=>'£'.number_format($stats['revenue'],2), 'icon'=>'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 'color'=>'text-emerald-400'],
            ];
        @endphp
        @foreach($cards as $card)
        <div class="card p-4">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 {{ $card['color'] }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $card['icon'] }}"/>
                    </svg>
                </div>
                <div>
                    <p class="text-xs text-slate-500">{{ $card['label'] }}</p>
                    <p class="text-lg font-semibold text-white">{{ $card['value'] }}</p>
                </div>
            </div>
        </div>
        @endforeach
    </div>

    <div class="card">
        <div class="flex items-center justify-between px-5 py-4 border-b border-surface-700">
            <h2 class="text-sm font-semibold text-white">Recent Invoices</h2>
            <a href="{{ route('admin.invoices.index') }}" class="text-xs text-blue-400 hover:text-blue-300">View all</a>
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
                        <td class="px-5 py-3 text-blue-400 font-medium">{{ $inv->invoice_number }}</td>
                        <td class="px-5 py-3 text-slate-300">{{ $inv->customer->name }}</td>
                        <td class="px-5 py-3 text-slate-400">{{ $inv->invoice_date->format('d M Y') }}</td>
                        <td class="px-5 py-3 text-right text-white font-medium">£{{ number_format($inv->total_amount, 2) }}</td>
                    </tr>
                    @empty
                    <tr><td colspan="4" class="px-5 py-8 text-center text-slate-500 text-sm">No invoices yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-app-layout>
