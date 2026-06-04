<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Agent;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => redirect()->route('login'));

Route::get('/login',  [AuthController::class, 'showLogin'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout',[AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ── Admin ────────────────────────────────────────────────────────────────────
Route::prefix('admin')->name('admin.')->middleware(['auth','role:admin'])->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/categories',                     [Admin\CategoryController::class, 'index'])  ->name('categories.index');
    Route::post('/categories',                    [Admin\CategoryController::class, 'store'])  ->name('categories.store');
    Route::put('/categories/{category}',          [Admin\CategoryController::class, 'update']) ->name('categories.update');
    Route::patch('/categories/{category}/toggle', [Admin\CategoryController::class, 'toggle']) ->name('categories.toggle');
    Route::delete('/categories/{category}',       [Admin\CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/products',                    [Admin\ProductController::class, 'index'])  ->name('products.index');
    Route::post('/products',                   [Admin\ProductController::class, 'store'])  ->name('products.store');
    Route::put('/products/{product}',          [Admin\ProductController::class, 'update']) ->name('products.update');
    Route::patch('/products/{product}/toggle', [Admin\ProductController::class, 'toggle']) ->name('products.toggle');
    Route::delete('/products/{product}',       [Admin\ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/customers',              [Admin\CustomerController::class, 'index'])     ->name('customers.index');
    Route::post('/customers',             [Admin\CustomerController::class, 'store'])     ->name('customers.store');
    Route::put('/customers/{customer}',   [Admin\CustomerController::class, 'update'])   ->name('customers.update');
    Route::delete('/customers/{customer}',[Admin\CustomerController::class, 'destroy'])  ->name('customers.destroy');
    Route::post('/customers/quick',       [Admin\CustomerController::class, 'quickStore'])->name('customers.quick');

    Route::get('/settings',  [Admin\SettingsController::class, 'index']) ->name('settings.index');
    Route::put('/settings',  [Admin\SettingsController::class, 'update'])->name('settings.update');

    Route::get('/invoices',              [Admin\InvoiceController::class, 'index'])       ->name('invoices.index');
    Route::get('/invoices/create',       [Admin\InvoiceController::class, 'create'])      ->name('invoices.create');
    Route::post('/invoices',             [Admin\InvoiceController::class, 'store'])       ->name('invoices.store');
    Route::get('/invoices/{invoice}',    [Admin\InvoiceController::class, 'show'])        ->name('invoices.show');
    Route::delete('/invoices/{invoice}', [Admin\InvoiceController::class, 'destroy'])     ->name('invoices.destroy');
    Route::get('/customers/{customer}/data', [Admin\InvoiceController::class, 'customerData'])->name('customers.data');
});

// ── Agent ────────────────────────────────────────────────────────────────────
Route::prefix('agent')->name('agent.')->middleware(['auth','role:agent'])->group(function () {
    Route::get('/dashboard', [Agent\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/invoices',              [Agent\InvoiceController::class, 'index'])  ->name('invoices.index');
    Route::get('/invoices/create',       [Agent\InvoiceController::class, 'create']) ->name('invoices.create');
    Route::post('/invoices',             [Agent\InvoiceController::class, 'store'])  ->name('invoices.store');
    Route::get('/invoices/{invoice}',    [Agent\InvoiceController::class, 'show'])   ->name('invoices.show');
    Route::get('/customers/{customer}/data', [Agent\InvoiceController::class, 'customerData'])->name('customers.data');
    Route::post('/customers',            [Agent\CustomerController::class, 'store']) ->name('customers.store');
});
