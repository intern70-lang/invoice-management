<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Agent;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => redirect()->route('login'));

Route::get('/login',  [AuthController::class, 'showLogin'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::get('/test-inertia', function () {
    return inertia::render('Test');
});

// ── Admin ────────────────────────────────────────────────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/categories',                     [Admin\CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories',                    [Admin\CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}',          [Admin\CategoryController::class, 'update'])->name('categories.update');
    Route::patch('/categories/{category}/toggle', [Admin\CategoryController::class, 'toggle'])->name('categories.toggle');
    Route::delete('/categories/{category}',       [Admin\CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/products/next-sku', [Admin\ProductController::class, 'nextSku']);
    Route::get('/products',                    [Admin\ProductController::class, 'index'])->name('products.index');
    Route::post('/products/add',                   [Admin\ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{product}',          [Admin\ProductController::class, 'update'])->name('products.update');
    Route::patch('/products/{product}/toggle', [Admin\ProductController::class, 'toggle'])->name('products.toggle');
    Route::delete('/products/{product}',       [Admin\ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/customers',              [Admin\CustomerController::class, 'index'])->name('customers.index');
    Route::post('/customers',             [Admin\CustomerController::class, 'store'])->name('customers.store');
    // Route::post('/customers/quick',       [Admin\CustomerController::class, 'quickStore'])->name('customers.quick');
    Route::put('/customers/{customer}',   [Admin\CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}', [Admin\CustomerController::class, 'destroy'])->name('customers.destroy');

    Route::get('/settings',  [Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings',  [Admin\SettingsController::class, 'update'])->name('settings.update');

    // ✅ Must be ABOVE your resource route for invoices
    Route::get('/invoices/next-number', [Admin\InvoiceController::class, 'nextNumber']);
    Route::get('/invoices',              [Admin\InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/create',       [Admin\InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('/invoices',             [Admin\InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/invoices/{invoice}',    [Admin\InvoiceController::class, 'show'])->name('invoices.show');
    Route::patch('/invoices/{invoice}/status', [Admin\InvoiceController::class, 'updateStatus'])->name('invoices.status.update');
    Route::delete('/invoices/{invoice}', [Admin\InvoiceController::class, 'destroy'])->name('invoices.destroy');
    Route::get('/customers/{customer}/data', [Admin\InvoiceController::class, 'customerData'])->name('customers.data');

    // ── New Modules ──────────────────────────────────────────────────────────
    Route::get('/areas',         [Admin\AreaController::class, 'index'])->name('areas.index');
    Route::post('/areas',        [Admin\AreaController::class, 'store'])->name('areas.store');
    Route::put('/areas/{area}',  [Admin\AreaController::class, 'update'])->name('areas.update');
    Route::patch('/areas/{area}/toggle', [Admin\AreaController::class, 'toggle'])->name('areas.toggle');
    Route::delete('/areas/{area}', [Admin\AreaController::class, 'destroy'])->name('areas.destroy');

    Route::get('/manufacturers',                       [Admin\ManufacturerController::class, 'index'])->name('manufacturers.index');
    Route::post('/manufacturers',                      [Admin\ManufacturerController::class, 'store'])->name('manufacturers.store');
    Route::put('/manufacturers/{manufacturer}',        [Admin\ManufacturerController::class, 'update'])->name('manufacturers.update');
    Route::patch('/manufacturers/{manufacturer}/toggle', [Admin\ManufacturerController::class, 'toggle'])->name('manufacturers.toggle');
    Route::delete('/manufacturers/{manufacturer}',     [Admin\ManufacturerController::class, 'destroy'])->name('manufacturers.destroy');

    Route::get('/vendors',                 [Admin\VendorController::class, 'index'])->name('vendors.index');
    Route::post('/vendors',                [Admin\VendorController::class, 'store'])->name('vendors.store');
    Route::put('/vendors/{vendor}',        [Admin\VendorController::class, 'update'])->name('vendors.update');
    Route::patch('/vendors/{vendor}/toggle', [Admin\VendorController::class, 'toggle'])->name('vendors.toggle');
    Route::delete('/vendors/{vendor}',     [Admin\VendorController::class, 'destroy'])->name('vendors.destroy');
});

// ── Agent ────────────────────────────────────────────────────────────────────
Route::prefix('agent')->name('agent.')->middleware(['auth', 'role:agent'])->group(function () {
    Route::get('/dashboard', [Agent\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/invoices',              [Agent\InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/create',       [Agent\InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('/invoices',             [Agent\InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/invoices/{invoice}',    [Agent\InvoiceController::class, 'show'])->name('invoices.show');
    Route::patch('/invoices/{invoice}/status', [Agent\InvoiceController::class, 'updateStatus'])->name('invoices.status.update');
    Route::delete('/invoices/{invoice}', [Agent\InvoiceController::class, 'destroy'])->name('invoices.destroy');

    Route::get('/customers/{customer}/data', [Agent\InvoiceController::class, 'customerData'])->name('customers.data');
    Route::post('/customers',            [Agent\CustomerController::class, 'store'])->name('customers.store');
});
