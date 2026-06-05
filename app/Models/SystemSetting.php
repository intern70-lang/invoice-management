<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'app_name',
        'logo',
        'address',
        'phone',
        'email',

        'bank_name',
        'iban',
        'swift_code',

        'theme_mode',
        'primary_color',
        'secondary_color',

        'currency_code',
        'currency_symbol',
    ];

    public static function get(): self
    {
        return static::firstOrCreate([], [
            'app_name' => 'InvoiceApp',
        ]);
    }
}