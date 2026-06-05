<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {

            $table->string('theme_mode')
                ->default('dark')
                ->after('swift_code');

            $table->string('primary_color')
                ->default('#1677ff')
                ->after('theme_mode');

            $table->string('secondary_color')
                ->default('#13c2c2')
                ->after('primary_color');

            $table->string('currency_code')
                ->default('GBP')
                ->after('secondary_color');

            $table->string('currency_symbol')
                ->default('£')
                ->after('currency_code');
        });
    }

    public function down(): void
    {
        Schema::table('system_settings', function (Blueprint $table) {

            $table->dropColumn([
                'theme_mode',
                'primary_color',
                'secondary_color',
                'currency_code',
                'currency_symbol',
            ]);
        });
    }
};