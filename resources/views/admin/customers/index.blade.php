<x-app-layout title="Customers">
    <div class="flex items-center justify-between mb-5">
        <div>
            <h2 class="text-base font-semibold text-white">Customers</h2>
            <p class="text-xs text-slate-500 mt-0.5">Manage your customer base</p>
        </div>
        <button onclick="openModal('addCustomerModal')" class="btn btn-primary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Customer
        </button>
    </div>

    <div class="card">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-surface-700">
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Name</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Email</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Phone</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Type</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">VAT No.</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($customers as $c)
                    <tr class="table-row">
                        <td class="px-5 py-3 text-white font-medium">{{ $c->name }}</td>
                        <td class="px-5 py-3 text-slate-400">{{ $c->email ?? '—' }}</td>
                        <td class="px-5 py-3 text-slate-400">{{ $c->phone ?? '—' }}</td>
                        <td class="px-5 py-3">
                            <span class="text-xs px-2 py-0.5 rounded-full {{ $c->customer_type === 'business' ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-700 text-slate-300' }}">
                                {{ ucfirst($c->customer_type) }}
                            </span>
                        </td>
                        <td class="px-5 py-3 text-slate-400">{{ $c->vat_registered ? ($c->vat_number ?? '—') : '—' }}</td>
                        <td class="px-5 py-3">
                            <div class="flex items-center justify-end gap-2">
                                <button onclick='openEditCustomer(@json($c))' class="btn btn-secondary text-xs py-1 px-2">Edit</button>
                                <form action="{{ route('admin.customers.destroy', $c) }}" method="POST" data-confirm="Delete this customer?">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn btn-danger text-xs py-1 px-2">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="6" class="px-5 py-8 text-center text-slate-500">No customers yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @foreach(['add','edit'] as $mode)
    <div id="{{ $mode }}CustomerModal" class="modal-backdrop">
        <div class="modal-box">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-sm font-semibold text-white">{{ $mode === 'add' ? 'Add' : 'Edit' }} Customer</h3>
                <button onclick="closeModal('{{ $mode }}CustomerModal')" class="btn btn-ghost p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <form id="{{ $mode }}CustomerForm" method="POST"
                  action="{{ $mode === 'add' ? route('admin.customers.store') : '#' }}" novalidate>
                @csrf
                @if($mode === 'edit') @method('PUT') @endif
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Full Name <span class="text-red-400">*</span></label>
                        <input type="text" name="name" id="{{ $mode }}CName" class="input"
                               placeholder="e.g. John Smith" data-validate="alpha" required autocomplete="off">
                        <span class="field-error"></span>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Email <span class="text-red-400">*</span></label>
                        <input type="email" name="email" id="{{ $mode }}CEmail" class="input"
                               placeholder="john@example.com" required autocomplete="off">
                        <span class="field-error"></span>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                        <input type="text" name="phone" id="{{ $mode }}CPhone" class="input"
                               placeholder="+44 7700 000000" data-validate="phone" maxlength="15" minlength="7" autocomplete="off">
                        <span class="field-error"></span>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Customer Type <span class="text-red-400">*</span></label>
                        <select name="customer_type" id="{{ $mode }}CType" class="input">
                            <option value="regular">Regular</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">VAT Registered</label>
                        <select name="vat_registered" id="{{ $mode }}CVatReg" class="input"
                                onchange="toggleVatNum('{{ $mode }}')">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                    </div>
                    <div class="col-span-2" id="{{ $mode }}VatNumWrap" style="display:none">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">VAT Number <span class="text-red-400">*</span></label>
                        <input type="text" name="vat_number" id="{{ $mode }}CVatNum" class="input" maxlength="17"
                               placeholder="GB123456789" data-validate="iban" autocomplete="off">
                        <span class="field-error"></span>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Address</label>
                        <textarea name="address" id="{{ $mode }}CAddr" rows="2" class="input resize-none"
                                  placeholder="Street, City, Postcode"></textarea>
                    </div>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" onclick="closeModal('{{ $mode }}CustomerModal')" class="btn btn-secondary text-xs">Cancel</button>
                    <button type="submit" class="btn btn-primary text-xs">{{ $mode === 'add' ? 'Save' : 'Update' }} Customer</button>
                </div>
            </form>
        </div>
    </div>
    @endforeach

    @push('scripts')
    <script>
        function openModal(id) { document.getElementById(id).classList.add('open'); }
        function closeModal(id) { document.getElementById(id).classList.remove('open'); }
        function toggleVatNum(mode) {
            const reg = document.getElementById(mode + 'CVatReg').value;
            document.getElementById(mode + 'VatNumWrap').style.display = reg === '1' ? '' : 'none';
        }
        function openEditCustomer(c) {
            document.getElementById('editCustomerForm').action = `/admin/customers/${c.id}`;
            document.getElementById('editCName').value   = c.name;
            document.getElementById('editCEmail').value  = c.email  || '';
            document.getElementById('editCPhone').value  = c.phone  || '';
            document.getElementById('editCType').value   = c.customer_type;
            document.getElementById('editCAddr').value   = c.address || '';
            document.getElementById('editCVatReg').value = c.vat_registered ? '1' : '0';
            document.getElementById('editCVatNum').value = c.vat_number || '';
            toggleVatNum('edit');
            openModal('editCustomerModal');
        }
        document.querySelectorAll('.modal-backdrop').forEach(m => {
            m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
        });

        // Customer Forms Validation
        function validateCustomerForm(mode) {
            let isValid = true;

            const name = $(`#${mode}CName`);
            const email = $(`#${mode}CEmail`);
            const phone = $(`#${mode}CPhone`);
            const vatReg = $(`#${mode}CVatReg`);
            const vatNum = $(`#${mode}CVatNum`);
            const address = $(`#${mode}CAddr`);

            // 1. Required field validations
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

            // 2. Email validation (required + format)
            if (!Validation.required(email, 'Email address is required')) {
                isValid = false;
            } else if (!Validation.email(email, 'Please enter a valid email address')) {
                isValid = false;
            }

            // 3. SQL Injection check
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

        $(document).ready(function() {
            // Apply formatting/sanitization on typing
            $(document).on('input', '#addCName, #editCName', function() {
                Validation.allowOnlyLetters(this);
            });
            $(document).on('input', '#addCAddr, #editCAddr', function() {
                Validation.descriptionText(this);
            });

            // Bind submit events
            $('#addCustomerForm').on('submit', function(e) {
                if (!validateCustomerForm('add')) {
                    e.preventDefault();
                }
            });
            $('#editCustomerForm').on('submit', function(e) {
                if (!validateCustomerForm('edit')) {
                    e.preventDefault();
                }
            });
        });
    </script>
    @endpush
</x-app-layout>
