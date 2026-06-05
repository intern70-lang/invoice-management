<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products   = Product::with('category')->latest()->get();
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Products', [
            'products'   => $products,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(ValidationRules::product(), ValidationRules::productMessages());

        Product::create($request->all() + ['is_active' => true]);

        return back()->with('success', 'Product "' . $request->name . '" created successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate(ValidationRules::product(), ValidationRules::productMessages());

        $product->update($request->all());

        return back()->with('success', 'Product "' . $request->name . '" updated successfully.');
    }

    public function toggle(Product $product)
    {
        $product->update(['is_active' => !$product->is_active]);

        $status = $product->is_active ? 'enabled' : 'disabled';

        return back()->with('success', 'Product "' . $product->name . '" ' . $status . '.');
    }

    public function destroy(Product $product)
    {
        $name = $product->name;
        $product->delete();

        return back()->with('success', 'Product "' . $name . '" deleted.');
    }
}

