<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Manufacturer;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ManufacturerController extends Controller
{
    public function index()
    {
        $manufacturers = Manufacturer::latest()->get();

        return Inertia::render('Admin/Manufacturers', [
            'manufacturers' => $manufacturers,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ValidationRules::manufacturer(), ValidationRules::manufacturerMessages());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Manufacturer::create([
            'name' => $request->name,
            'number' => $request->number,
            'email' => $request->email,
            'address' => $request->address,
            'is_active' => true,
        ]);

        return back()->with('success', 'Manufacturer "' . $request->name . '" created successfully.');
    }

    public function update(Request $request, Manufacturer $manufacturer)
    {
        $validator = Validator::make($request->all(), ValidationRules::manufacturer($manufacturer->id), ValidationRules::manufacturerMessages());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $manufacturer->update([
            'name' => $request->name,
            'number' => $request->number,
            'email' => $request->email,
            'address' => $request->address,
        ]);

        return back()->with('success', 'Manufacturer "' . $request->name . '" updated successfully.');
    }

    public function toggle(Manufacturer $manufacturer)
    {
        $manufacturer->update(['is_active' => !$manufacturer->is_active]);
        $status = $manufacturer->is_active ? 'enabled' : 'disabled';

        return back()->with('success', 'Manufacturer "' . $manufacturer->name . '" ' . $status . '.');
    }

    public function destroy(Manufacturer $manufacturer)
    {
        $name = $manufacturer->name;
        $manufacturer->delete();

        return back()->with('success', 'Manufacturer "' . $name . '" deleted.');
    }
}
