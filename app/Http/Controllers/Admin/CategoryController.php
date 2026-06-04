<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::latest()->get();
        return view('admin.categories.index', compact('categories'));
    }

    

    public function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), ValidationRules::category(), ValidationRules::categoryMessages());
        if ($validator->fails()) {
            return back()->with('toast_error', $validator->errors()->first());
        }
        $category->update(['name' => $request->name]);
        return back()->with('toast_success', 'Category updated successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ValidationRules::category(), ValidationRules::categoryMessages());
        if ($validator->fails()) {
            return back()->with('toast_error', $validator->errors()->first());
        }
        Category::create(['name' => $request->name, 'is_active' => true]);
        return back()->with('toast_success', 'Category <strong>' . e($request->name) . '</strong> created successfully.');
    }

    public function toggle(Category $category)
    {
        $category->update(['is_active' => !$category->is_active]);
        $status = $category->is_active ? 'enabled' : 'disabled';
        return back()->with('toast_success', 'Category <strong>' . e($category->name) . '</strong> ' . $status . '.');
    }

    public function destroy(Category $category)
    {
        $name = $category->name;
        $category->delete();
        return back()->with('toast_success', 'Category <strong>' . e($name) . '</strong> deleted.');
    }
}
