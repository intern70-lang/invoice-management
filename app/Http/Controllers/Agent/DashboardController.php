<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Invoice;

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

        return view('agent.dashboard', compact('recentInvoices', 'stats'));
    }
}
