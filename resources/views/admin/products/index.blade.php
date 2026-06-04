<x-app-layout title="Products">
    <div class="flex items-center justify-between mb-5">
        <div>
            <h2 class="text-base font-semibold text-white">Products</h2>
            <p class="text-xs text-slate-500 mt-0.5">Manage your product catalog</p>
        </div>
        <button onclick="openModal('addProductModal')" class="btn btn-primary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Product
        </button>
    </div>

    <div class="card">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-surface-700">
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Name</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Category</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">Purchase</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">Selling</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">Qty</th>
                        <th class="text-center text-xs text-slate-500 font-medium px-5 py-3">VAT</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Status</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($products as $p)
                    <tr class="table-row">
                        <td class="px-5 py-3">
                            <p class="text-white font-medium">{{ $p->name }}</p>
                            @if($p->description)
                                <p class="text-xs text-slate-500 truncate max-w-xs">{{ $p->description }}</p>
                            @endif
                        </td>
                        <td class="px-5 py-3 text-slate-400">{{ $p->category?->name ?? '—' }}</td>
                        <td class="px-5 py-3 text-right text-slate-300">£{{ number_format($p->purchase_price,2) }}</td>
                        <td class="px-5 py-3 text-right text-white font-medium">£{{ number_format($p->selling_price,2) }}</td>
                        <td class="px-5 py-3 text-right text-slate-300">{{ $p->qty }}</td>
                        <td class="px-5 py-3 text-center text-slate-300">{{ $p->vat }}%</td>
                        <td class="px-5 py-3">
                            <span class="{{ $p->is_active ? 'badge-active' : 'badge-inactive' }}">
                                {{ $p->is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-5 py-3">
                            <div class="flex items-center justify-end gap-2">
                                <form action="{{ route('admin.products.toggle', $p) }}" method="POST">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="btn btn-ghost text-xs py-1 px-2">
                                        {{ $p->is_active ? 'Disable' : 'Enable' }}
                                    </button>
                                </form>
                                <button onclick='openEditProduct(@json($p))' class="btn btn-secondary text-xs py-1 px-2">Edit</button>
                                <form action="{{ route('admin.products.destroy', $p) }}" method="POST" data-confirm="Delete this product?">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn btn-danger text-xs py-1 px-2">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="8" class="px-5 py-8 text-center text-slate-500">No products yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @foreach(['add','edit'] as $mode)
    <div id="{{ $mode }}ProductModal" class="modal-backdrop">
        <div class="modal-box">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-sm font-semibold text-white">{{ $mode === 'add' ? 'Add' : 'Edit' }} Product</h3>
                <button onclick="closeModal('{{ $mode }}ProductModal')" class="btn btn-ghost p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <form id="{{ $mode }}ProductForm" method="POST"
                  action="{{ $mode === 'add' ? route('admin.products.store') : '#' }}" novalidate>
                @csrf
                @if($mode === 'edit') @method('PUT') @endif
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Product Name <span class="text-red-400">*</span></label>
                        <input type="text" name="name" id="{{ $mode }}PName" class="input"
                               placeholder="e.g. iPhone 15 Pro" data-validate="alphanumeric" required autocomplete="off">
                        <span class="field-error"></span>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                        <textarea name="description" id="{{ $mode }}PDesc" rows="2" class="input resize-none"
                                  placeholder="Optional product description"></textarea>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Category <span class="text-red-400">*</span></label>
                        <select name="category_id" id="{{ $mode }}PCat" class="input select2-cat" required>
                            <option value="">— None —</option>
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                            @endforeach
                        </select>
                        <span class="field-error"></span>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Qty <span class="text-red-400">*</span></label>
                        <input type="number" name="qty" id="{{ $mode }}PQty" class="input"
                               placeholder="0" min="0" data-validate="integer" required>
                        <span class="field-error"></span>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">MOQ <span class="text-red-400">*</span></label>
                        <input type="number" name="moq" id="{{ $mode }}PMoq" class="input"
                               placeholder="1" min="1" data-validate="integer" required>
                        <span class="field-error"></span>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Purchase Price <span class="text-red-400">*</span></label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">£</span>
                            <input type="number" name="purchase_price" id="{{ $mode }}PPurchase" step="0.01" min="0"
                                   class="input pl-6" placeholder="0.00" data-validate="decimal" required>
                        </div>
                        <span class="field-error"></span>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Selling Price <span class="text-red-400">*</span></label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">£</span>
                            <input type="number" name="selling_price" id="{{ $mode }}PSelling" step="0.01" min="0"
                                   class="input pl-6" placeholder="0.00" data-validate="decimal" required>
                        </div>
                        <span class="field-error"></span>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">VAT <span class="text-red-400">*</span></label>
                        <select name="vat" id="{{ $mode }}PVat" class="input">
                            <option value="0">0%</option>
                            <option value="20">20%</option>
                        </select>
                    </div>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" onclick="closeModal('{{ $mode }}ProductModal')" class="btn btn-secondary text-xs">Cancel</button>
                    <button type="submit" class="btn btn-primary text-xs">{{ $mode === 'add' ? 'Save' : 'Update' }} Product</button>
                </div>
            </form>
        </div>
    </div>
    @endforeach

    @push('scripts')
    <script>
        function openModal(id) { document.getElementById(id).classList.add('open'); }
        function closeModal(id) { document.getElementById(id).classList.remove('open'); }
        function openEditProduct(p) {
            document.getElementById('editProductForm').action = `/admin/products/${p.id}`;
            document.getElementById('editPName').value     = p.name;
            document.getElementById('editPDesc').value     = p.description || '';
            document.getElementById('editPQty').value      = p.qty;
            document.getElementById('editPMoq').value      = p.moq;
            document.getElementById('editPPurchase').value = p.purchase_price;
            document.getElementById('editPSelling').value  = p.selling_price;
            document.getElementById('editPVat').value      = p.vat;
            $('#editPCat').val(p.category_id || '').trigger('change');
            openModal('editProductModal');
        }
        document.querySelectorAll('.modal-backdrop').forEach(m => {
            m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
        });

        // Product Forms Validation
        function validateProductForm(mode) {
            let isValid = true;

            const name = $(`#${mode}PName`);
            const desc = $(`#${mode}PDesc`);
            const cat = $(`#${mode}PCat`);
            const qty = $(`#${mode}PQty`);
            const moq = $(`#${mode}PMoq`);
            const purchase = $(`#${mode}PPurchase`);
            const selling = $(`#${mode}PSelling`);

            // 1. Required field validations
            if (!Validation.required(name, 'Product Name is required')) {
                isValid = false;
            }
            if (!Validation.required(cat, 'Category is required')) {
                isValid = false;
            }
            if (!Validation.required(qty, 'Quantity is required')) {
                isValid = false;
            }
            if (!Validation.required(moq, 'MOQ is required')) {
                isValid = false;
            }
            // Ensure MOQ is not greater than Quantity
            if (parseInt(moq.val()) > parseInt(qty.val())) {
                GT.toast('MOQ cannot be greater than Quantity', 'error');
                isValid = false;
            }
            if (!Validation.required(purchase, 'Purchase Price is required')) {
                isValid = false;
            }
            if (!Validation.required(selling, 'Selling Price is required')) {
                isValid = false;
            }
            // Ensure Selling Price is not less than Purchase Price
            const purchaseVal = parseFloat(purchase.val());
            const sellingVal = parseFloat(selling.val());
            if (!isNaN(purchaseVal) && !isNaN(sellingVal) && sellingVal < purchaseVal) {
                Validation.showError(selling, 'Selling Price cannot be less than Purchase Price');
                GT.toast('Selling Price cannot be less than Purchase Price', 'error');
                isValid = false;
            }

            // 2. SQL Injection check
            const inputsToCheck = [name, desc, qty, moq, purchase, selling];
            for (let input of inputsToCheck) {
                if (Validation.detectSqlInjection(input)) {
                    Validation.showError(input, 'Suspicious input patterns detected!');
                    GT.toast('Suspicious input blocked!', 'error');
                    return false;
                }
            }

            if (!isValid) {
                GT.toast('Please fill all required fields correctly', 'error');
                return false;
            }

            return true;
        }

        // Select2 and validation bindings
        $(document).ready(function () {
            $('.select2-cat').select2({
                placeholder: '— None —',
                allowClear: true,
                dropdownParent: $('body'),
            });

            // Apply formatting/sanitization on typing
            $(document).on('input', '#addProductModal [data-validate="integer"], #editProductModal [data-validate="integer"]', function() {
                Validation.allowOnlyNumbers(this);
            });
            $(document).on('input', '#addProductModal [data-validate="decimal"], #editProductModal [data-validate="decimal"]', function() {
                Validation.allowDecimalNumbers(this);
            });
            $(document).on('input', '#addPDesc, #editPDesc', function() {
                Validation.descriptionText(this);
            });

            // Bind submit events
            $('#addProductForm').on('submit', function(e) {
                if (!validateProductForm('add')) {
                    e.preventDefault();
                }
            });
            $('#editProductForm').on('submit', function(e) {
                if (!validateProductForm('edit')) {
                    e.preventDefault();
                }
            });
        });
    </script>
    @endpush
</x-app-layout>
