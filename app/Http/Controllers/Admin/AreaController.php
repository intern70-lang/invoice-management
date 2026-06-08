<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AreaController extends Controller
{
    public function index()
    {
        $areas = Area::latest()->get();

        return Inertia::render('Admin/Areas', ['areas' => $areas]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ValidationRules::area(), ValidationRules::areaMessages());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Area::create([
            'name' => $request->name,
            'is_active' => true,
        ]);

        return back()->with('success', 'Area "' . $request->name . '" created successfully.');
    }

    public function update(Request $request, Area $area)
    {
        $validator = Validator::make($request->all(), ValidationRules::area($area->id), ValidationRules::areaMessages());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $area->update([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Area "' . $request->name . '" updated successfully.');
    }

    public function toggle(Area $area)
    {
        $area->update(['is_active' => !$area->is_active]);
        $status = $area->is_active ? 'enabled' : 'disabled';

        return back()->with('success', 'Area "' . $area->name . '" ' . $status . '.');
    }

    public function destroy(Area $area)
    {
        $name = $area->name;
        $area->delete();

        return back()->with('success', 'Area "' . $name . '" deleted.');
    }
}
