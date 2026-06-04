{{-- Reusable invoice form body --}}
{{-- Props: $customers, $products, $storeRoute, $indexRoute, $customerDataRoute, $quickCustomerRoute --}}

<div class="max-w-5xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
        <a href="{{ $indexRoute }}" class="btn btn-ghost p-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </a>
        <h2 class="text-base font-semibold text-white">New Invoice</h2>
    </div>

    <form id="invoiceForm" action="{{ $storeRoute }}" method="POST" onsubmit="return validateInvoiceForm()" novalidate>
        @csrf

        {{-- Invoice Items --}}
        <div class="card p-5 mb-4">

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-3">Invoice Date <span class="text-red-400">*</span></label>
                    <input type="date" name="invoice_date" id="invoiceDate" value="{{ date('Y-m-d') }}"
                           class="input" max="{{ date('Y-m-d') }}" required>
                    <span class="field-error" id="invoiceDateErr"></span>
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-3">Due Date <span class="text-red-400">*</span></label>
                    <input type="date" name="due_date" id="invoiceDueDate" class="input" min="{{ date('Y-m-d') }}" required>
                    <span class="field-error" id="invoiceDueDateErr"></span>
                </div>
                <div>
                    <div class="flex justify-between items-center gap-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Customer <span class="text-red-400">*</span></label>
                        <button type="button" onclick="openModal('quickCustomerModal')"
                        class="btn btn-ghost text-xs text-blue-400 hover:text-blue-500 flex-shrink-0" title="Add new customer">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                         New Customer
                    </button>
                </div>
                    <select name="customer_id" id="customerSelect" class="input flex-1 select2-customer" required
                    onchange="loadCustomerData(this.value)">
                    <option value="">— Select Customer —</option>
                    @foreach($customers as $c)
                    <option value="{{ $c->id }}">{{ $c->name }}</option>
                    @endforeach
                </select>
                    <span class="field-error" id="customerErr"></span>
                </div>
            </div>

            {{-- Customer Info Labels --}}
            <div id="customerInfo" class="mt-4 hidden">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-surface-700 rounded-lg">
                    <div><p class="text-xs text-slate-500">Name</p><p id="cInfoName" class="text-sm text-white mt-0.5 truncate">—</p></div>
                    <div><p class="text-xs text-slate-500">Email</p><p id="cInfoEmail" class="text-sm text-white mt-0.5 truncate">—</p></div>
                    <div><p class="text-xs text-slate-500">Phone</p><p id="cInfoPhone" class="text-sm text-white mt-0.5">—</p></div>
                    <div><p class="text-xs text-slate-500">VAT Number</p><p id="cInfoVat" class="text-sm text-white mt-0.5">—</p></div>
                </div>
            </div>

            <div class="mt-2">
                    <label class="block text-xs font-medium text-slate-400 mb-1.5">Remarks / Notes</label>
                    <textarea name="remarks" id="invoiceRemarks" rows="3" class="input resize-none text-sm"
                              placeholder="Add payment terms, banking details or notes..."></textarea>
                    <span class="field-error" id="invoiceRemarksErr"></span>
                </div>

            <hr class="border-surface-700 my-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-semibold text-white">Invoice Items</h3>
                <button type="button" onclick="addRow()" class="btn btn-secondary text-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Add Product
                </button>
            </div>
            <span class="field-error" id="itemsErr"></span>

            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-surface-700">
                            <th class="text-left text-xs text-slate-500 font-medium pb-3 pr-3">Product</th>
                            <th class="text-right text-xs text-slate-500 font-medium pb-3 px-3 w-28">Price (ex. VAT)</th>
                            <th class="text-center text-xs text-slate-500 font-medium pb-3 px-3 w-24">VAT %</th>
                            <th class="text-right text-xs text-slate-500 font-medium pb-3 px-3 w-20">Qty</th>
                            <th class="text-right text-xs text-slate-500 font-medium pb-3 px-3 w-28">VAT Amt</th>
                            <th class="text-right text-xs text-slate-500 font-medium pb-3 pl-3 w-28">Total</th>
                            <th class="w-10"></th>
                        </tr>
                    </thead>
                    <tbody id="itemsBody"></tbody>
                </table>
            </div>

            {{-- Totals and Remarks --}}
            <!-- <div class="mt-4 pt-4 border-t border-surface-700 grid grid-cols-1 md:grid-cols-2 gap-6"> -->
                <!-- <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1.5">Remarks / Notes</label>
                    <textarea name="remarks" id="invoiceRemarks" rows="3" class="input resize-none text-sm"
                              placeholder="Add payment terms, banking details or notes..."></textarea>
                    <span class="field-error" id="invoiceRemarksErr"></span>
                </div> -->
                <div class="flex justify-end items-start pt-12">
                    <div class="w-96 space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-400">Total VAT (exclusive)</span>
                            <span id="totalVat" class="text-white font-medium">£0.00</span>
                        </div>
                        <div class="flex justify-between text-base font-semibold border-t border-surface-600 pt-2 mt-2">
                            <span class="text-white">Total Amount</span>
                            <span id="totalAmount" class="text-blue-400">£0.00</span>
                        </div>
                    </div>
                </div>
            <!-- </div> -->
        </div>

        <div class="flex justify-end gap-3">
            <a href="{{ $indexRoute }}" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Save Invoice
            </button>
        </div>
    </form>
</div>

{{-- Quick Add Customer Modal --}}
<div id="quickCustomerModal" class="modal-backdrop">
    <div class="modal-box">
        <div class="flex items-center justify-between mb-5">
            <h3 class="text-sm font-semibold text-white">New Customer</h3>
            <button onclick="closeModal('quickCustomerModal')" class="btn btn-ghost p-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Full Name <span class="text-red-400">*</span></label>
                <input type="text" id="qcName" class="input" placeholder="John Smith"
                       data-validate="alpha" autocomplete="off">
                <span class="field-error" id="qcNameErr"></span>
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Email <span class="text-red-400">*</span></label>
                <input type="email" id="qcEmail" class="input" placeholder="john@example.com" required autocomplete="off">
                <span class="field-error" id="qcEmailErr"></span>
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                <input type="text" id="qcPhone" class="input" placeholder="+44 7700 000000"
                       data-validate="phone" maxlength="15" autocomplete="off">
                <span class="field-error" id="qcPhoneErr"></span>
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Type <span class="text-red-400">*</span></label>
                <select id="qcType" class="input">
                    <option value="regular">Regular</option>
                    <option value="business">Business</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-slate-400 mb-1.5">VAT Registered</label>
                <select id="qcVatReg" class="input"
                        onchange="document.getElementById('qcVatNumWrap').style.display=this.value==='1'?'':'none'">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>
            <div class="col-span-2" id="qcVatNumWrap" style="display:none">
                <label class="block text-xs font-medium text-slate-400 mb-1.5">VAT Number <span class="text-red-400">*</span></label>
                <input type="text" id="qcVatNum" class="input" placeholder="GB123456789" maxlength="17"
                       data-validate="iban" autocomplete="off">
                <span class="field-error" id="qcVatNumErr"></span>
            </div>
            <div class="col-span-2">
                <label class="block text-xs font-medium text-slate-400 mb-1.5">Address</label>
                <textarea id="qcAddr" rows="2" class="input resize-none" placeholder="Street, City, Postcode"></textarea>
            </div>
        </div>
        <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal('quickCustomerModal')" class="btn btn-secondary text-xs">Cancel</button>
            <button type="button" id="qcSaveBtn" class="btn btn-primary text-xs">Save & Select</button>
        </div>
    </div>
</div>

@push('scripts')
<script>
const PRODUCTS         = @json($products);
const CUSTOMER_DATA_URL = '{{ $customerDataRoute }}';
const QUICK_CUSTOMER_URL= '{{ $quickCustomerRoute }}';
let rowIndex = 0;

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-backdrop').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ── Sync Due Date min with Invoice Date ─────────────────────────────────────
function syncDueDateMin() {
    const invDate = document.getElementById('invoiceDate').value;
    const dueDateEl = document.getElementById('invoiceDueDate');
    if (invDate) {
        dueDateEl.min = invDate;
        // If already picked a due date that is now before the new invoice date, clear it
        if (dueDateEl.value && dueDateEl.value < invDate) {
            dueDateEl.value = '';
            window.Validation && Validation.clearError(dueDateEl);
        }
    }
}
document.getElementById('invoiceDate').addEventListener('change', syncDueDateMin);
syncDueDateMin();

// ── Select2 for customer dropdown ────────────────────────────────────────────
$(document).ready(function () {
    $('.select2-customer').select2({
        placeholder: '— Select Customer —',
        allowClear: true,
    });
    $('.select2-customer').on('change', function () {
        window.Validation.clearError(this);
        loadCustomerData(this.value);
    });

    // Sanitization for quick customer modal fields
    $(document).on('input', '#qcName', function() {
        Validation.allowOnlyLetters(this);
    });
    $(document).on('input', '#qcAddr', function() {
        Validation.descriptionText(this);
    });
    $(document).on('input', '#invoiceRemarks', function() {
        Validation.descriptionText(this);
    });
});

// ── Customer info panel ──────────────────────────────────────────────────────
function loadCustomerData(id) {
    if (!id) { document.getElementById('customerInfo').classList.add('hidden'); return; }
    const url = CUSTOMER_DATA_URL.replace('__ID__', id);
    fetch(url).then(r => r.json()).then(c => {
        document.getElementById('cInfoName').textContent  = c.name  || '—';
        document.getElementById('cInfoEmail').textContent = c.email || '—';
        document.getElementById('cInfoPhone').textContent = c.phone || '—';
        document.getElementById('cInfoVat').textContent   = c.vat_registered ? (c.vat_number || '—') : 'Not registered';
        document.getElementById('customerInfo').classList.remove('hidden');
    });
}

// ── Add invoice row ──────────────────────────────────────────────────────────
function addRow() {
    const i = rowIndex++;
    const opts = PRODUCTS.map(p =>
        `<option value="${p.id}" data-price="${p.selling_price}" data-vat="${p.vat}" data-moq="${p.moq}">${p.name}</option>`
    ).join('');

    const tr = document.createElement('tr');
    tr.className = 'table-row';
    tr.id = `row-${i}`;
    tr.innerHTML = `
        <td class="pr-3 py-2">
            <select name="items[${i}][product_id]" id="prod-${i}" class="input text-sm select2-product" required
                    data-row="${i}">
                <option value="">— Select —</option>${opts}
            </select>
        </td>
        <td class="px-3 py-2">
            <div class="relative">
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">£</span>
                <input type="number" name="items[${i}][selling_price]" id="price-${i}" step="0.01" min="0"
                       class="input text-right text-sm pl-5 min-w-[100px]" value="0" oninput="calcRow(${i})"
                       data-validate="decimal" required>
            </div>
        </td>
        <td class="px-3 py-2">
            <select name="items[${i}][vat_percent]" id="vat-${i}" class="input text-sm min-w-[90px]" onchange="calcRow(${i})">
                <option value="0">0%</option>
                <option value="20">20%</option>
            </select>
        </td>
        <td class="px-3 py-2">
            <input type="number" name="items[${i}][qty]" id="qty-${i}" min="1" value="1"
                   class="input text-right text-sm min-w-[80px]" oninput="calcRow(${i})"
                   title="Minimum order quantity applies"
                   data-validate="integer" required>
        </td>
        <td class="px-3 py-2 text-right text-slate-300 text-sm" id="vatamt-${i}">£0.00</td>
        <td class="pl-3 py-2 text-right text-white font-medium text-sm" id="linetotal-${i}">£0.00</td>
        <td class="pl-2 py-2">
            <button type="button" onclick="removeRow(${i})"
                    class="btn btn-ghost p-1 text-red-400 hover:text-red-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </td>`;
    document.getElementById('itemsBody').appendChild(tr);

    // Init Select2 for this row's product dropdown
    $(`#prod-${i}`).select2({
        placeholder: '— Select product —',
        dropdownParent: $('body'),
    }).on('change', function () {
        window.Validation.clearError(this);
        onProductChange(this, i);
    });

    // Re-apply key restrictions to new inputs
    document.querySelectorAll(`#row-${i} [data-validate]`).forEach(el => {
        applyKeyRestriction(el);
    });
}

function applyKeyRestriction(el) {
    const type = el.dataset.validate;
    if (type === 'integer') {
        el.addEventListener('keydown', e => {
            const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'];
            if (allowed.includes(e.key)) return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
        });
    } else if (type === 'decimal') {
        el.addEventListener('keydown', e => {
            const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'];
            if (allowed.includes(e.key)) return;
            if (e.key === '.' && !el.value.includes('.')) return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
        });
    }
}

function onProductChange(sel, i) {
    const opt = sel.options[sel.selectedIndex];
    document.getElementById(`price-${i}`).value = opt.dataset.price || 0;
    document.getElementById(`vat-${i}`).value   = opt.dataset.vat   || 0;

    // Enforce MOQ as the minimum qty for this row
    const moq    = parseInt(opt.dataset.moq) || 1;
    const qtyEl  = document.getElementById(`qty-${i}`);
    qtyEl.min    = moq;
    // Set qty to MOQ if the current value is below it
    if (parseInt(qtyEl.value) < moq) {
        qtyEl.value = moq;
    }
    qtyEl.title = `Min. order qty: ${moq}`;

    calcRow(i);
}

function calcRow(i) {
    const price    = parseFloat(document.getElementById(`price-${i}`).value) || 0;
    const qty      = parseInt(document.getElementById(`qty-${i}`).value)     || 0;
    const vat      = parseInt(document.getElementById(`vat-${i}`).value)     || 0;
    const vatAmt   = price * qty * (vat / 100);
    const lineTotal= price * qty + vatAmt;
    document.getElementById(`vatamt-${i}`).textContent    = '£' + vatAmt.toFixed(2);
    document.getElementById(`linetotal-${i}`).textContent = '£' + lineTotal.toFixed(2);
    calcTotals();
}

function calcTotals() {
    let tv = 0, ta = 0;
    document.querySelectorAll('[id^="vatamt-"]').forEach(el => tv += parseFloat(el.textContent.replace('£','')) || 0);
    document.querySelectorAll('[id^="linetotal-"]').forEach(el => ta += parseFloat(el.textContent.replace('£','')) || 0);
    document.getElementById('totalVat').textContent    = '£' + tv.toFixed(2);
    document.getElementById('totalAmount').textContent = '£' + ta.toFixed(2);
}

function removeRow(i) {
    document.getElementById(`row-${i}`)?.remove();
    calcTotals();
}

// ── Invoice form validation ──────────────────────────────────────────────────
function validateInvoiceForm() {
    let valid = true;

    // Customer
    const cust = $('#customerSelect');
    if (!Validation.required(cust, 'Please select a customer.')) {
        valid = false;
    }

    // Date
    const dt = $('#invoiceDate');
    if (!Validation.required(dt, 'Invoice date is required.')) {
        valid = false;
    }

    // Due Date
    // Due Date (required)
    const dueDate = $('#invoiceDueDate');
    if (!Validation.required(dueDate, 'Due date is required')) {
        valid = false;
    } else {
        const dateVal = new Date(dt.val());
        const dueDateVal = new Date(dueDate.val());
        if (dueDateVal < dateVal) {
            Validation.showError(dueDate, 'Due date must be on or after the invoice date.');
            valid = false;
        } else {
            Validation.clearError(dueDate);
        }
    }

    // Remarks
    const remarks = $('#invoiceRemarks');
    Validation.clearError(remarks);

    // SQL Injection check on main invoice fields
    const invoiceInputsToCheck = [dt, dueDate, remarks];
    for (let input of invoiceInputsToCheck) {
        if (Validation.detectSqlInjection(input)) {
            Validation.showError(input, 'Suspicious input patterns detected!');
            GT.toast('Suspicious input blocked!', 'error');
            return false;
        }
    }

    // Items
    const rows = $('#itemsBody tr');
    const itemsErr = $('#itemsErr');
    
    if (rows.length === 0) {
        itemsErr.removeClass('hidden').text('Please add at least one product.');
        valid = false;
    } else {
        itemsErr.addClass('hidden').text('');
        let rowValid = true;
        
        rows.each(function() {
            const i = this.id.replace('row-','');
            const prodSel = $(`#prod-${i}`);
            const qtyEl   = $(`#qty-${i}`);
            const priceEl = $(`#price-${i}`);
            
            if (!Validation.required(prodSel, 'Please select a product.')) {
                rowValid = false;
            }
            if (!Validation.required(qtyEl, 'Quantity is required.')) {
                rowValid = false;
            } else if (parseInt(qtyEl.val()) < 1) {
                Validation.showError(qtyEl, 'Quantity must be at least 1.');
                rowValid = false;
            }
            if (!Validation.required(priceEl, 'Price is required.')) {
                rowValid = false;
            }
        });
        
        if (!rowValid) {
            itemsErr.removeClass('hidden').text('Please select a product and enter a valid quantity/price for all rows.');
            valid = false;
        }
    }

    if (!valid) showToast('Please fix the highlighted errors.', 'error');
    return valid;
}

// ── Quick customer validation helper ─────────────────────────────────────────
function validateQuickCustomer() {
    let isValid = true;

    const name = $('#qcName');
    const email = $('#qcEmail');
    const phone = $('#qcPhone');
    const vatReg = $('#qcVatReg');
    const vatNum = $('#qcVatNum');
    const address = $('#qcAddr');

    if (!Validation.required(name, 'Full Name is required')) {
        isValid = false;
    }

    if (vatReg.val() === '1') {
        if (!Validation.required(vatNum, 'VAT Number is required when VAT registered is Yes')) {
            isValid = false;
        }
    } else {
        Validation.clearError(vatNum);
    }

    if (!Validation.required(email, 'Email address is required')) {
        isValid = false;
    } else if (!Validation.email(email, 'Please enter a valid email address')) {
        isValid = false;
    }

    const inputsToCheck = [name, email, phone, vatNum, address];
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

// ── Quick customer save ──────────────────────────────────────────────────────
document.getElementById('qcSaveBtn').addEventListener('click', async () => {
    // Clear previous error messages
    ['qcName','qcEmail','qcPhone','qcVatNum','qcAddr'].forEach(id => {
        Validation.clearError(document.getElementById(id));
    });

    if (!validateQuickCustomer()) {
        return;
    }

    const btn = document.getElementById('qcSaveBtn');
    btn.disabled = true;
    btn.textContent = 'Saving…';

    const data = {
        name:          document.getElementById('qcName').value,
        email:         document.getElementById('qcEmail').value,
        phone:         document.getElementById('qcPhone').value,
        customer_type: document.getElementById('qcType').value,
        vat_registered:document.getElementById('qcVatReg').value,
        vat_number:    document.getElementById('qcVatNum').value,
        address:       document.getElementById('qcAddr').value,
    };

    try {
        const token = document.querySelector('meta[name=csrf-token]').content;
        const res   = await fetch(QUICK_CUSTOMER_URL, {
            method: 'POST',
            headers: { 'Content-Type':'application/json', 'X-CSRF-TOKEN': token },
            body: JSON.stringify(data),
        });
        const json = await res.json();

        if (!res.ok) {
            // Show field errors
            if (json.errors) {
                Object.entries(json.errors).forEach(([field, msgs]) => {
                    const errId = 'qc' + field.charAt(0).toUpperCase() + field.slice(1);
                    const errInput = document.getElementById(errId);
                    if (errInput) {
                        Validation.showError(errInput, msgs[0]);
                    }
                });
                showToast('Please fix the errors in the customer form.', 'error');
            }
            return;
        }

        // Add to Select2 and select it
        const sel = document.getElementById('customerSelect');
        const opt = new Option(json.name, json.id, true, true);
        $(sel).append(opt).trigger('change');
        loadCustomerData(json.id);
        closeModal('quickCustomerModal');
        showToast(`Customer <strong>${json.name}</strong> created and selected.`, 'success');

        // Reset form
        ['qcName','qcEmail','qcPhone','qcVatNum','qcAddr'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('qcVatReg').value = '0';
        document.getElementById('qcVatNumWrap').style.display = 'none';
    } catch (e) {
        showToast('Unexpected error saving customer.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save & Select';
    }
});

// Start with one row
addRow();
</script>
@endpush
