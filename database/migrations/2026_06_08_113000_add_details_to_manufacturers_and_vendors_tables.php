<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('manufacturers', function (Blueprint $table) {
            $table->string('name', 100)->after('id');
            $table->string('number', 30)->nullable()->after('name');
            $table->string('email')->nullable()->after('number');
            $table->text('address')->nullable()->after('email');
            $table->boolean('is_active')->default(true)->after('address');
        });

        Schema::table('vendors', function (Blueprint $table) {
            $table->string('name', 100)->after('id');
            $table->string('company')->nullable()->after('name');
            $table->string('phone', 30)->nullable()->after('company');
            $table->string('email')->nullable()->after('phone');
            $table->string('tax_reg_number', 100)->nullable()->after('email');
            $table->string('address_line_1')->nullable()->after('tax_reg_number');
            $table->string('address_line_2')->nullable()->after('address_line_1');
            $table->string('city', 100)->nullable()->after('address_line_2');
            $table->string('pincode', 20)->nullable()->after('city');
            $table->string('state', 100)->nullable()->after('pincode');
            $table->string('country', 100)->nullable()->after('state');
            $table->boolean('is_active')->default(true)->after('country');
        });
    }

    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'company',
                'phone',
                'email',
                'tax_reg_number',
                'address_line_1',
                'address_line_2',
                'city',
                'pincode',
                'state',
                'country',
                'is_active',
            ]);
        });

        Schema::table('manufacturers', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'number',
                'email',
                'address',
                'is_active',
            ]);
        });
    }
};
