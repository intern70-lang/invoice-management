<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\Customer;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::with('area')->latest()->get();
        $areas = Area::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Customers', [
            'customers' => $customers,
            'areas' => $areas,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(ValidationRules::customer(), ValidationRules::customerMessages());

        Customer::create($this->customerPayload($request));

        return back()->with('success', 'Customer "' . $request->name . '" created successfully.');
    }

    public function update(Request $request, Customer $customer)
    {
        $request->validate(ValidationRules::customer($customer->id), ValidationRules::customerMessages());

        $customer->update($this->customerPayload($request));

        return back()->with('success', 'Customer "' . $request->name . '" updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $name = $customer->name;
        $customer->delete();

        return back()->with('success', 'Customer "' . $name . '" deleted.');
    }

    // Quick store via JSON (from invoice page quick-add modal)
    // public function quickStore(Request $request)
    // {
    //     $validator = \Illuminate\Support\Facades\Validator::make(
    //         $request->all(),
    //         ValidationRules::customer(),
    //         ValidationRules::customerMessages()
    //     );

    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     $customer = Customer::create($this->customerPayload($request));
    //     $customer->load('area');

    //     return response()->json($customer);
    // }

    private function customerPayload(Request $request): array
    {
        return [
            'customer_type' => $request->input('customer_type', 'individual'),
            'name' => $request->name,
            'phone' => $request->phone,
            'gender' => $request->gender,
            'email' => $request->email,
            'birthdate' => $request->birthdate,
            'area_id' => $request->area_id,
            'shipping_address' => $request->shipping_address,
            'address' => $request->address,
            'city' => $request->city,
            'pin_code' => $request->pin_code,
            'state' => $request->state,
            'country' => $request->country,
            'landmark' => $request->landmark,
            'credit_day' => $request->credit_day,
            'credit_amount' => $request->credit_amount,
            'vat_registered' => $request->vat_registered,
            'vat_number' => $request->vat_registered ? $request->vat_number : null
        ];
    }
}
