<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Laravel doesn't provide a portable enum alter. Use raw SQL.
        DB::statement(
            "ALTER TABLE invoices MODIFY status ENUM('draft','saved','printed','paid','unpaid') NOT NULL DEFAULT 'draft'"
        );
    }

    public function down(): void
    {
        DB::statement(
            "ALTER TABLE invoices MODIFY status ENUM('draft','saved','printed') NOT NULL DEFAULT 'draft'"
        );
    }
};
