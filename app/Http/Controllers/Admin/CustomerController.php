<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::latest()->get();

        return Inertia::render('Admin/Customers', [
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $rules = ValidationRules::customer();
        if ($request->boolean('vat_registered')) {
            $rules['vat_number'] = ['required', 'string', 'regex:/^[a-zA-Z0-9]+$/', 'max:50'];
        }
        $request->validate($rules, ValidationRules::customerMessages());

        Customer::create(array_merge(
            $request->all(),
            ['vat_registered' => $request->boolean('vat_registered')]
        ));

        return back()->with('success', 'Customer "' . $request->name . '" created successfully.');
    }

    public function update(Request $request, Customer $customer)
    {
        $rules = ValidationRules::customer();
        if ($request->boolean('vat_registered')) {
            $rules['vat_number'] = ['required', 'string', 'regex:/^[a-zA-Z0-9]+$/', 'max:50'];
        }
        $request->validate($rules, ValidationRules::customerMessages());

        $customer->update(array_merge(
            $request->all(),
            ['vat_registered' => $request->boolean('vat_registered')]
        ));

        return back()->with('success', 'Customer "' . $request->name . '" updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $name = $customer->name;
        $customer->delete();

        return back()->with('success', 'Customer "' . $name . '" deleted.');
    }

    // Quick store via JSON (from invoice page quick-add modal)
    public function quickStore(Request $request)
    {
        $rules = ValidationRules::customer();
        if ($request->boolean('vat_registered')) {
            $rules['vat_number'] = ['required', 'string', 'regex:/^[a-zA-Z0-9]+$/', 'max:50'];
        }

        $validator = \Illuminate\Support\Facades\Validator::make(
            $request->all(),
            $rules,
            ValidationRules::customerMessages()
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer = Customer::create(array_merge(
            $request->all(),
            ['vat_registered' => $request->boolean('vat_registered')]
        ));

        return response()->json($customer);
    }
}
