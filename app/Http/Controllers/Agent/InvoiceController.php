<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\SystemSetting;
use Inertia\Inertia;
use App\Services\ValidationRules;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with('customer')
            ->where('created_by', auth()->id())
            ->latest()
            ->get();
        return inertia('Agent/Invoices', compact('invoices'));
    }

    public function updateStatus(Request $request, Invoice $invoice)
    {
        abort_if($invoice->created_by !== auth()->id(), 403);

        $request->validate([
            'status' => ['required', 'in:paid,unpaid'],
        ]);

        $invoice->update([
            'status' => $request->input('status'),
        ]);

        return redirect()->back()->with(
            'toast_success',
            "Invoice {$invoice->invoice_number} status updated successfully."
        );
    }

    public function destroy(Invoice $invoice)
    {
        abort_if($invoice->created_by !== auth()->id(), 403);

        $number = $invoice->invoice_number;
        $invoice->delete();

        return redirect()->back()->with(
            'toast_success',
            "Invoice {$number} deleted."
        );
    }


    public function create()
    {
        $customers = Customer::orderBy('name')->get();
        $products  = Product::where('is_active', true)->orderBy('name')->get();
        return inertia('Agent/CreateInvoice', [
            'customers' => $customers,
            'products' => $products,
            'areas' => [],
            'settings' => SystemSetting::get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(ValidationRules::invoice(), ValidationRules::invoiceMessages());

        $invoice = Invoice::create([
            'invoice_number' => Invoice::generateNumber(),
            'customer_id'    => $request->customer_id,
            'created_by'     => auth()->id(),
            'invoice_date'   => $request->invoice_date,
            'due_date'       => $request->due_date,
            'remarks'        => $request->remarks,
            'total_vat'      => 0,
            'total_amount'   => 0,
            'status'         => 'saved',
        ]);

        $totalVat = $totalAmount = 0;
        foreach ($request->items as $item) {
            $product   = Product::find($item['product_id']);
            $price     = (float) $item['selling_price'];
            $qty       = (int)   $item['qty'];
            $vatPct    = (int)   $item['vat_percent'];
            $vatAmt    = round($price * $qty * ($vatPct / 100), 2);
            $lineTotal = round($price * $qty + $vatAmt, 2);

            $invoice->items()->create([
                'product_id'    => $item['product_id'],
                'product_name'  => $product->name,
                'selling_price' => $price,
                'vat_percent'   => $vatPct,
                'qty'           => $qty,
                'vat_amount'    => $vatAmt,
                'line_total'    => $lineTotal,
            ]);
            $totalVat    += $vatAmt;
            $totalAmount += $lineTotal;
        }
        $invoice->update(['total_vat' => $totalVat, 'total_amount' => $totalAmount]);
        return redirect()->route('agent.invoices.show', $invoice)
            ->with('toast_success', 'Invoice' . $invoice->invoice_number . 'saved successfully.');
    }

    public function show(Invoice $invoice)
    {
        abort_if($invoice->created_by !== auth()->id(), 403);
        $invoice->load('customer', 'items.product', 'creator');
        $settings = SystemSetting::get();
        $invoice->currency_symbol = $settings['currency_symbol'] ?? ($settings->currency_symbol ?? '£');
        return inertia('Agent/ShowInvoice', compact('invoice', 'settings'));
    }

    public function customerData(Customer $customer)
    {
        return response()->json($customer);
    }
}
