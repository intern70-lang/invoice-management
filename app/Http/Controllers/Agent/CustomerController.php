<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ValidationRules::customer(), ValidationRules::customerMessages());
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $customer = Customer::create([
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
        ]);

        return response()->json($customer);
    }
}
