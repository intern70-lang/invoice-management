<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Manufacturer;
use App\Models\Product;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products   = Product::with(['category', 'manufacturer'])->latest()->get();
        $categories = Category::where('is_active', true)->orderBy('name')->get();
        $manufacturers = Manufacturer::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Products', [
            'products'      => $products,
            'categories'    => $categories,
            'manufacturers' => $manufacturers,
        ]);
    }

    public function store(Request $request)
    {
        // dd([
        //     'files' => $request->files->all(),
        //     'hasFile' => $request->hasFile('image'),
        //     'all' => $request->all(),
        // ]);
        try {
            $this->normalizeProductInput($request);

            $validated = $request->validate(ValidationRules::product(), ValidationRules::productMessages());
            $validated['is_active'] = true; // New products are active by default

            Product::create($this->productPayload($request, $validated));
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Product $product)
    {
        $this->normalizeProductInput($request);

        $validated = $request->validate(ValidationRules::product($product->id), ValidationRules::productMessages());

        $product->update($this->productPayload($request, $validated, $product));

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
        if ($product->image) {
            $this->deleteProductImage($product->image);
        }

        $product->delete();

        return back()->with('success', 'Product "' . $name . '" deleted.');
    }

    private function productPayload(Request $request, array $validated, ?Product $product = null): array
    {
        $data = collect($validated)->except(['image'])->toArray();

        foreach (
            [
                'purchase_tax_inclusive',
                'sale_tax_inclusive',
                'is_weighing_item',
            ] as $field
        ) {
            $data[$field] = $request->boolean($field);
        }

        foreach (
            [
                'discount_percent',
                'cess_percent',
                'additional_cess',
            ] as $field
        ) {
            $data[$field] = $request->input($field, 0) ?: 0;
        }

        if ($request->hasFile('image')) {
            if ($product?->image) {
                $this->deleteProductImage($product->image);
            }

            $data['image'] = $this->storeProductImage($request);
        }

        return $data;
    }

    private function storeProductImage(Request $request): string
    {
        $directory = public_path('images/products');

        if (! File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $file = $request->file('image');
        $filename = $file->hashName();

        $file->move($directory, $filename);

        return 'images/products/' . $filename;
    }

    private function deleteProductImage(string $path): void
    {
        $fullPath = public_path($path);

        if (File::exists($fullPath) && File::isFile($fullPath)) {
            File::delete($fullPath);
        }
    }

    private function normalizeProductInput(Request $request): void
    {
        if ($request->has('image') && ! $request->hasFile('image')) {
            $request->request->remove('image');
        }

        $request->merge([
            'name'          => trim((string) $request->input('name', '')),
            'item_code'     => trim((string) $request->input('item_code', '')),
            'hsn_code'      => trim((string) $request->input('hsn_code', '')),
            'regional_name' => trim((string) $request->input('regional_name', '')),
            'unit'          => trim((string) $request->input('unit', '')),
        ]);
    }
}
