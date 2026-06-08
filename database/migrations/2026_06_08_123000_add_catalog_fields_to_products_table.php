<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'image')) {
                $table->string('image')->nullable()->after('id');
            }

            if (! Schema::hasColumn('products', 'item_code')) {
                $table->string('item_code')->nullable()->unique()->after('name');
            }

            if (! Schema::hasColumn('products', 'manufacturer_id')) {
                $table->foreignId('manufacturer_id')->nullable()->after('category_id')->constrained()->nullOnDelete();
            }

            if (! Schema::hasColumn('products', 'item_class')) {
                $table->string('item_class', 30)->default('general')->after('manufacturer_id');
            }

            if (! Schema::hasColumn('products', 'hsn_code')) {
                $table->string('hsn_code', 50)->nullable()->after('item_class');
            }

            if (! Schema::hasColumn('products', 'regional_name')) {
                $table->string('regional_name')->nullable()->after('hsn_code');
            }

            if (! Schema::hasColumn('products', 'unit')) {
                $table->string('unit', 50)->default('pcs')->after('regional_name');
            }

            if (! Schema::hasColumn('products', 'purchase_tax_inclusive')) {
                $table->boolean('purchase_tax_inclusive')->default(false)->after('purchase_price');
            }

            if (! Schema::hasColumn('products', 'sale_tax_inclusive')) {
                $table->boolean('sale_tax_inclusive')->default(false)->after('vat');
            }

            if (! Schema::hasColumn('products', 'discount_percent')) {
                $table->decimal('discount_percent', 5, 2)->default(0)->after('sale_tax_inclusive');
            }

            if (! Schema::hasColumn('products', 'cess_percent')) {
                $table->decimal('cess_percent', 5, 2)->default(0)->after('discount_percent');
            }

            if (! Schema::hasColumn('products', 'additional_cess')) {
                $table->decimal('additional_cess', 12, 2)->default(0)->after('cess_percent');
            }

            if (! Schema::hasColumn('products', 'is_weighing_item')) {
                $table->boolean('is_weighing_item')->default(false)->after('additional_cess');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'manufacturer_id')) {
                $table->dropConstrainedForeignId('manufacturer_id');
            }

            foreach ([
                'image',
                'item_code',
                'item_class',
                'hsn_code',
                'regional_name',
                'unit',
                'purchase_tax_inclusive',
                'sale_tax_inclusive',
                'discount_percent',
                'cess_percent',
                'additional_cess',
                'is_weighing_item',
            ] as $column) {
                if (Schema::hasColumn('products', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
