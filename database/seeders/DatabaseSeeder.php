<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SystemSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@example.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Agent User',
            'email'    => 'agent@example.com',
            'password' => Hash::make('password'),
            'role'     => 'agent',
        ]);

        SystemSetting::create([
            'app_name' => 'InvoiceApp',
            'address'  => '123 Business St, City',
            'phone'    => '+1 234 567 890',
            'email'    => 'info@invoiceapp.com',
        ]);
    }
}
