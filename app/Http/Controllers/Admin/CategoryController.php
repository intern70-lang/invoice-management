<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::latest()->get();

        return Inertia::render('Admin/Categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ValidationRules::category(), ValidationRules::categoryMessages());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Category::create(['name' => $request->name, 'is_active' => true]);

        return back()->with('success', 'Category "' . $request->name . '" created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), ValidationRules::category(), ValidationRules::categoryMessages());
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $category->update(['name' => $request->name]);

        return back()->with('success', 'Category "' . $request->name . '" updated successfully.');
    }

    public function toggle(Category $category)
    {
        $category->update(['is_active' => !$category->is_active]);
        $status = $category->is_active ? 'enabled' : 'disabled';

        return back()->with('success', 'Category "' . $category->name . '" ' . $status . '.');
    }

    public function destroy(Category $category)
    {
        $name = $category->name;
        $category->delete();

        return back()->with('success', 'Category "' . $name . '" deleted.');
    }
}