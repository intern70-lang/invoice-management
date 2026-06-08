<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE customers MODIFY customer_type ENUM('regular', 'business', 'individual', 'company') NOT NULL DEFAULT 'individual'");

        DB::table('customers')
            ->where('customer_type', 'regular')
            ->update(['customer_type' => 'individual']);

        DB::table('customers')
            ->where('customer_type', 'business')
            ->update(['customer_type' => 'company']);

        DB::statement("ALTER TABLE customers MODIFY customer_type ENUM('individual', 'company') NOT NULL DEFAULT 'individual'");

        Schema::table('customers', function (Blueprint $table) {
            $table->foreignId('area_id')->nullable()->after('customer_type')->constrained('areas')->nullOnDelete();
            $table->string('gender', 20)->nullable()->after('phone');
            $table->date('birthdate')->nullable()->after('email');
            $table->text('shipping_address')->nullable()->after('address');
            $table->string('city', 100)->nullable()->after('shipping_address');
            $table->string('pin_code', 20)->nullable()->after('city');
            $table->string('state', 100)->nullable()->after('pin_code');
            $table->string('country', 100)->nullable()->after('state');
            $table->string('landmark')->nullable()->after('country');
            $table->unsignedInteger('credit_day')->nullable()->after('landmark');
            $table->decimal('credit_amount', 12, 2)->nullable()->after('credit_day');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('area_id');
            $table->dropColumn([
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
            ]);
        });

        DB::statement("ALTER TABLE customers MODIFY customer_type ENUM('regular', 'business', 'individual', 'company') NOT NULL DEFAULT 'regular'");

        DB::table('customers')
            ->where('customer_type', 'individual')
            ->update(['customer_type' => 'regular']);

        DB::table('customers')
            ->where('customer_type', 'company')
            ->update(['customer_type' => 'business']);

        DB::statement("ALTER TABLE customers MODIFY customer_type ENUM('regular', 'business') NOT NULL DEFAULT 'regular'");
    }
};
