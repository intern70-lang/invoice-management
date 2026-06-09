<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'image',
        'name',
        'item_code',
        'description',
        'category_id',
        'manufacturer_id',
        'item_class',
        'hsn_code',
        'regional_name',
        'unit',
        'qty',
        'purchase_price',
        'purchase_tax_inclusive',
        'selling_price',
        'vat',
        'sale_tax_inclusive',
        'discount_percent',
        'cess_percent',
        'additional_cess',
        'is_weighing_item',
        'moq',
        'is_active',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'discount_percent' => 'decimal:2',
        'cess_percent' => 'decimal:2',
        'additional_cess' => 'decimal:2',
        'purchase_tax_inclusive' => 'boolean',
        'sale_tax_inclusive' => 'boolean',
        'is_weighing_item' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function manufacturer()
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    // In Product.php model, add this boot method:
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->item_code)) {
                $product->item_code = static::generateSku();
            }
        });
    }

    public static function generateSku(): string
    {
        do {
            $last = static::max('id') ?? 0;
            $sku  = 'SKU' . str_pad($last + 1, 6, '0', STR_PAD_LEFT);
        } while (static::where('item_code', $sku)->exists());

        return $sku;
    }
}
