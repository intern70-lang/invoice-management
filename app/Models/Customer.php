<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'customer_type',
        'name',
        'phone',
        'gender',
        'email',
        'birthdate',
        'area_id',
        'shipping_address',
        'address',
        'city',
        'pin_code',
        'state',
        'country',
        'landmark',
        'credit_day',
        'credit_amount',
        'vat_registered',
        'vat_number',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'credit_amount' => 'decimal:2',
        'vat_registered' => 'boolean',
    ];

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
