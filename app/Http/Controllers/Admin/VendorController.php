<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index()
    {
        $vendors = Vendor::latest()->get();

        return Inertia::render('Admin/Vendors', [
            'vendors' => $vendors,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ValidationRules::vendor(), ValidationRules::vendorMessages());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Vendor::create($request->only([
            'name',
            'company',
            'phone',
            'email',
            'tax_reg_number',
            'address_line_1',
            'address_line_2',
            'city',
            'pincode',
            'state',
            'country',
        ]) + ['is_active' => true]);

        return back()->with('success', 'Vendor "' . $request->name . '" created successfully.');
    }

    public function update(Request $request, Vendor $vendor)
    {
        $validator = Validator::make($request->all(), ValidationRules::vendor($vendor->id), ValidationRules::vendorMessages());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $vendor->update($request->only([
            'name',
            'company',
            'phone',
            'email',
            'tax_reg_number',
            'address_line_1',
            'address_line_2',
            'city',
            'pincode',
            'state',
            'country',
        ]));

        return back()->with('success', 'Vendor "' . $request->name . '" updated successfully.');
    }

    public function toggle(Vendor $vendor)
    {
        $vendor->update(['is_active' => !$vendor->is_active]);
        $status = $vendor->is_active ? 'enabled' : 'disabled';

        return back()->with('success', 'Vendor "' . $vendor->name . '" ' . $status . '.');
    }

    public function destroy(Vendor $vendor)
    {
        $name = $vendor->name;
        $vendor->delete();

        return back()->with('success', 'Vendor "' . $name . '" deleted.');
    }
}
