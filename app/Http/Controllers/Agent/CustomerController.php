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
        $rules = ValidationRules::customer();
        if ($request->boolean('vat_registered')) {
            $rules['vat_number'] = ['required', 'string', 'regex:/^[a-zA-Z0-9]+$/', 'max:50'];
        }
        $validator = Validator::make($request->all(), $rules, ValidationRules::customerMessages());
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $customer = Customer::create(array_merge($request->all(), ['vat_registered' => $request->boolean('vat_registered')]));
        return response()->json($customer);
    }
}
