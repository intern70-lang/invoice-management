<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\SystemSetting;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with('customer', 'creator')
            ->latest()
            ->get();

        return Inertia::render('Admin/Invoices', [
            'invoices' => $invoices,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CreateInvoice', [
            'customers' => Customer::orderBy('name')->get(),
            'products'  => Product::where('is_active', true)
                ->orderBy('name')
                ->get(),
            'settings' => SystemSetting::get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(
            ValidationRules::invoice(),
            ValidationRules::invoiceMessages()
        );

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

        $totalVat = 0;
        $totalAmount = 0;

        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);

            $price = (float) $item['selling_price'];
            $qty = (int) $item['qty'];
            $vatPct = (int) $item['vat_percent'];

            $vatAmt = round(
                $price * $qty * ($vatPct / 100),
                2
            );

            $lineTotal = round(
                ($price * $qty) + $vatAmt,
                2
            );

            $invoice->items()->create([
                'product_id'    => $product->id,
                'product_name'  => $product->name,
                'selling_price' => $price,
                'vat_percent'   => $vatPct,
                'qty'           => $qty,
                'vat_amount'    => $vatAmt,
                'line_total'    => $lineTotal,
            ]);

            $totalVat += $vatAmt;
            $totalAmount += $lineTotal;
        }

        $invoice->update([
            'total_vat' => $totalVat,
            'total_amount' => $totalAmount,
        ]);

        return redirect()
            ->route('admin.invoices.show', $invoice)
            ->with(
                'success',
                "Invoice {$invoice->invoice_number} saved successfully."
            );
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(
            'customer',
            'items.product',
            'creator'
        );

        return Inertia::render('Admin/ShowInvoice', [
            'invoice' => $invoice,
            'settings' => SystemSetting::get(),
        ]);
    }

    public function destroy(Invoice $invoice)
    {
        $number = $invoice->invoice_number;

        $invoice->delete();

        return back()->with(
            'success',
            "Invoice {$number} deleted."
        );
    }

    public function customerData(Customer $customer)
    {
        return response()->json($customer);
    }
}