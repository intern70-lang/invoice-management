<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = [
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
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
