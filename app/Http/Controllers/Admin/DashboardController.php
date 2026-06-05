<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'invoices'   => Invoice::count(),
            'customers'  => Customer::count(),
            'products'   => Product::count(),
            'categories' => Category::count(),
            'revenue'    => Invoice::sum('total_amount'),
        ];
        $recentInvoices = Invoice::with('customer')->latest()->take(5)->get();
        // return view('admin.dashboard', compact('stats', 'recentInvoices'));
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentInvoices' => $recentInvoices,
        ]);
    }
}
