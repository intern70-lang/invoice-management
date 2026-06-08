<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (! Schema::hasColumn('customers', 'area_id')) {
                $table->foreignId('area_id')->nullable()->after('customer_type')->constrained('areas')->nullOnDelete();
            }

            if (! Schema::hasColumn('customers', 'gender')) {
                $table->string('gender', 20)->nullable()->after('phone');
            }

            if (! Schema::hasColumn('customers', 'birthdate')) {
                $table->date('birthdate')->nullable()->after('email');
            }

            if (! Schema::hasColumn('customers', 'shipping_address')) {
                $table->text('shipping_address')->nullable()->after('address');
            }

            if (! Schema::hasColumn('customers', 'city')) {
                $table->string('city', 100)->nullable()->after('shipping_address');
            }

            if (! Schema::hasColumn('customers', 'pin_code')) {
                $table->string('pin_code', 20)->nullable()->after('city');
            }

            if (! Schema::hasColumn('customers', 'state')) {
                $table->string('state', 100)->nullable()->after('pin_code');
            }

            if (! Schema::hasColumn('customers', 'country')) {
                $table->string('country', 100)->nullable()->after('state');
            }

            if (! Schema::hasColumn('customers', 'landmark')) {
                $table->string('landmark')->nullable()->after('country');
            }

            if (! Schema::hasColumn('customers', 'credit_day')) {
                $table->unsignedInteger('credit_day')->nullable()->after('landmark');
            }

            if (! Schema::hasColumn('customers', 'credit_amount')) {
                $table->decimal('credit_amount', 12, 2)->nullable()->after('credit_day');
            }
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (Schema::hasColumn('customers', 'area_id')) {
                $table->dropConstrainedForeignId('area_id');
            }

            foreach ([
                'gender',
                'birthdate',
                'shipping_address',
                'city',
                'pin_code',
                'state',
                'country',
                'landmark',
                'credit_day',
                'credit_amount',
            ] as $column) {
                if (Schema::hasColumn('customers', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
