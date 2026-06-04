<x-app-layout title="Invoice {{ $invoice->invoice_number }}">
    <div class="max-w-3xl mx-auto">
        <div class="flex items-center justify-between mb-6 no-print">
            <div class="flex items-center gap-3">
                <a href="{{ route('admin.invoices.index') }}" class="btn btn-ghost p-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                </a>
                <h2 class="text-base font-semibold text-white">{{ $invoice->invoice_number }}</h2>
            </div>
            <button onclick="window.print()" class="btn btn-primary text-xs">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print
            </button>
        </div>

        {{-- Invoice Card --}}
        <div id="printArea" class="bg-white text-gray-800 rounded-xl p-8 shadow-2xl">
            {{-- Header --}}
            <div class="flex justify-between items-start mb-8">
                <div>
                    @if($settings->logo)
                        <img src="{{ Storage::url($settings->logo) }}" alt="Logo" class="h-12 mb-2">
                    @endif
                    <h1 class="text-2xl font-bold text-gray-900">{{ $settings->app_name }}</h1>
                    @if($settings->address)<p class="text-sm text-gray-500 mt-1">{{ $settings->address }}</p>@endif
                    @if($settings->phone)<p class="text-sm text-gray-500">{{ $settings->phone }}</p>@endif
                    @if($settings->email)<p class="text-sm text-gray-500">{{ $settings->email }}</p>@endif
                </div>
                <div class="text-right">
                    <h2 class="text-3xl font-light text-blue-600">INVOICE</h2>
                    <p class="text-lg font-semibold text-gray-700 mt-1">{{ $invoice->invoice_number }}</p>
                    <p class="text-sm text-gray-500 mt-1">Date: {{ $invoice->invoice_date?->format('d M Y') ?? 'Not set' }}</p>
                    <p class="text-sm text-gray-500 mt-1">Due Date: {{ $invoice->due_date?->format('d M Y') ?? 'Not set' }}</p>
                </div>
            </div>

            {{-- Bill To --}}
            <div class="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                    <p class="font-semibold text-gray-900">{{ $invoice->customer->name }}</p>
                    @if($invoice->customer->email)<p class="text-sm text-gray-600">{{ $invoice->customer->email }}</p>@endif
                    @if($invoice->customer->phone)<p class="text-sm text-gray-600">{{ $invoice->customer->phone }}</p>@endif
                    @if($invoice->customer->address)<p class="text-sm text-gray-600">{{ $invoice->customer->address }}</p>@endif
                    @if($invoice->customer->vat_registered && $invoice->customer->vat_number)
                        <p class="text-sm text-gray-600 mt-1">VAT No: <strong>{{ $invoice->customer->vat_number }}</strong></p>
                    @endif
                </div>
                @if($settings->bank_name || $settings->iban)
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment Details</p>
                    @if($settings->bank_name)<p class="text-sm text-gray-600">Bank: {{ $settings->bank_name }}</p>@endif
                    @if($settings->iban)<p class="text-sm text-gray-600">IBAN: {{ $settings->iban }}</p>@endif
                    @if($settings->swift_code)<p class="text-sm text-gray-600">SWIFT: {{ $settings->swift_code }}</p>@endif
                </div>
                @endif
            </div>

            {{-- Items Table --}}
            <table class="w-full mb-6 text-sm">
                <thead>
                    <tr class="border-b-2 border-gray-200">
                        <th class="text-left py-2 text-xs text-gray-500 font-semibold uppercase">Product</th>
                        <th class="text-right py-2 text-xs text-gray-500 font-semibold uppercase">Price</th>
                        <th class="text-center py-2 text-xs text-gray-500 font-semibold uppercase">VAT</th>
                        <th class="text-right py-2 text-xs text-gray-500 font-semibold uppercase">Qty</th>
                        <th class="text-right py-2 text-xs text-gray-500 font-semibold uppercase">VAT Amt</th>
                        <th class="text-right py-2 text-xs text-gray-500 font-semibold uppercase">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($invoice->items as $item)
                    <tr class="border-b border-gray-100">
                        <td class="py-3 font-medium text-gray-800">{{ $item->product_name }}</td>
                        <td class="py-3 text-right text-gray-600">£{{ number_format($item->selling_price, 2) }}</td>
                        <td class="py-3 text-center text-gray-600">{{ $item->vat_percent }}%</td>
                        <td class="py-3 text-right text-gray-600">{{ $item->qty }}</td>
                        <td class="py-3 text-right text-gray-600">£{{ number_format($item->vat_amount, 2) }}</td>
                        <td class="py-3 text-right font-semibold text-gray-900">£{{ number_format($item->line_total, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            {{-- Remarks --}}
            <div class="mt-4">
                <p class="text-sm text-gray-500">Remarks: {{ $invoice->remarks ?? 'No remarks' }}</p>
            </div>

            {{-- Totals --}}
            <div class="flex justify-end mb-8">
                <div class="w-56">
                    <div class="flex justify-between py-2 border-b border-gray-100 text-sm">
                        <span class="text-gray-500">Total VAT</span>
                        <span class="text-gray-700">£{{ number_format($invoice->total_vat, 2) }}</span>
                    </div>
                    <div class="flex justify-between py-3 text-base font-bold">
                        <span class="text-gray-900">Total Amount</span>
                        <span class="text-blue-600">£{{ number_format($invoice->total_amount, 2) }}</span>
                    </div>
                </div>
            </div>

            {{-- Footer --}}
            <div class="border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
                Thank you for your business! Generated by {{ $settings->app_name }}
            </div>
        </div>
    </div>

    @push('styles')
    <style>
        @media print {
            body { background: white !important; color: black !important; }
            #printArea { background: white; color: black; border-radius: 0; box-shadow: none; padding: 0; }
        }
    </style>
    @endpush
</x-app-layout>
