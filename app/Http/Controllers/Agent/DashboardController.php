<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $recentInvoices = Invoice::with('customer')
            ->where('created_by', auth()->id())
            ->latest()->take(5)->get();

        $stats = [
            'invoices' => Invoice::where('created_by', auth()->id())->count(),
            'revenue'  => Invoice::where('created_by', auth()->id())->sum('total_amount'),
        ];

        return inertia('Agent/Dashboard', compact('recentInvoices', 'stats'));
    }
}
