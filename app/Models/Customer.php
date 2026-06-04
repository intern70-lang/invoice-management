<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'customer_type',
        'address', 'vat_registered', 'vat_number',
    ];

    protected $casts = ['vat_registered' => 'boolean'];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
