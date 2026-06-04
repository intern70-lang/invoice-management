<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number', 'customer_id', 'created_by',
        'invoice_date', 'due_date', 'total_vat', 'total_amount', 'status', 'remarks',
    ];

    protected $casts = [
        'invoice_date' => 'date',
        'due_date' => 'date',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public static function generateNumber(): string
    {
        $last = static::latest()->first();
        $next = $last ? ((int) substr($last->invoice_number, 4)) + 1 : 1;
        return 'INV-' . str_pad($next, 5, '0', STR_PAD_LEFT);
    }
}
