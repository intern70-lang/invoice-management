<x-app-layout title="Categories">
    <div class="flex items-center justify-between mb-5">
        <div>
            <h2 class="text-base font-semibold text-white">Categories</h2>
            <p class="text-xs text-slate-500 mt-0.5">Manage product categories</p>
        </div>
        <button onclick="openModal('addCategoryModal')" class="btn btn-primary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Category
        </button>
    </div>

    <div class="card">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-surface-700">
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">#</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Name</th>
                        <th class="text-left text-xs text-slate-500 font-medium px-5 py-3">Status</th>
                        <th class="text-right text-xs text-slate-500 font-medium px-5 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($categories as $cat)
                    <tr class="table-row">
                        <td class="px-5 py-3 text-slate-500">{{ $loop->iteration }}</td>
                        <td class="px-5 py-3 text-white font-medium">{{ $cat->name }}</td>
                        <td class="px-5 py-3">
                            <form action="{{ route('admin.categories.toggle', $cat) }}" method="POST">
                                @csrf @method('PATCH')
                                <label class="toggle inline-block align-middle cursor-pointer">
                                    <input type="checkbox" onchange="this.closest('form').submit()" {{ $cat->is_active ? 'checked' : '' }}>
                                    <span class="toggle-slider"></span>
                                </label>
                            </form>
                        </td>
                        <td class="px-5 py-3">
                            <div class="flex items-center justify-end gap-2">
                                <button onclick="openEditCategory({{ $cat->id }}, '{{ addslashes($cat->name) }}')"
                                        class="btn btn-secondary text-xs py-1 px-2">Edit</button>
                                <form action="{{ route('admin.categories.destroy', $cat) }}" method="POST" data-confirm="Delete this category?">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn btn-danger text-xs py-1 px-2">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="4" class="px-5 py-8 text-center text-slate-500">No categories yet.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- Add Modal --}}
    <div id="addCategoryModal" class="modal-backdrop">
        <div class="modal-box">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-sm font-semibold text-white">Add Category</h3>
                <button onclick="closeModal('addCategoryModal')" class="btn btn-ghost p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <form action="{{ route('admin.categories.store') }}" method="POST" id="addCatForm" novalidate>
                @csrf
                <div class="mb-4">
                    <label class="block text-xs font-medium text-slate-400 mb-1.5">Category Name <span class="text-red-400">*</span></label>
                    <input type="text" name="name" id="addCatName" class="input" placeholder="e.g. Electronics"
                           data-validate="alphanumeric" required autocomplete="off">
                    <span class="field-error" id="addCatNameErr"></span>
                    <p class="text-xs text-slate-600 mt-1">Letters, numbers, spaces and hyphens only.</p>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" onclick="closeModal('addCategoryModal')" class="btn btn-secondary text-xs">Cancel</button>
                    <button type="submit" class="btn btn-primary text-xs">Save Category</button>
                </div>
            </form>
        </div>
    </div>

    {{-- Edit Modal --}}
    <div id="editCategoryModal" class="modal-backdrop">
        <div class="modal-box">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-sm font-semibold text-white">Edit Category</h3>
                <button onclick="closeModal('editCategoryModal')" class="btn btn-ghost p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <form id="editCategoryForm" method="POST" novalidate>
                @csrf @method('PUT')
                <div class="mb-4">
                    <label class="block text-xs font-medium text-slate-400 mb-1.5">Category Name <span class="text-red-400">*</span></label>
                    <input type="text" name="name" id="editCategoryName" class="input"
                           data-validate="alphanumeric" required autocomplete="off">
                    <span class="field-error"></span>
                    <p class="text-xs text-slate-600 mt-1">Letters, numbers, spaces and hyphens only.</p>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" onclick="closeModal('editCategoryModal')" class="btn btn-secondary text-xs">Cancel</button>
                    <button type="submit" class="btn btn-primary text-xs">Update</button>
                </div>
            </form>
        </div>
    </div>

    @push('scripts')
    <script>
        function openModal(id) { document.getElementById(id).classList.add('open'); }
        function closeModal(id) { document.getElementById(id).classList.remove('open'); }
        function openEditCategory(id, name) {
            document.getElementById('editCategoryForm').action = `/admin/categories/${id}`;
            document.getElementById('editCategoryName').value = name;
            openModal('editCategoryModal');
        }
        document.querySelectorAll('.modal-backdrop').forEach(m => {
            m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
        });

        // Category Forms Validation
        function validateCategoryForm(formId) {
            let isValid = true;
            const form = $(`#${formId}`);
            const name = form.find('input[name="name"]');

            if (!Validation.required(name, 'Category Name is required')) {
                isValid = false;
            }

            if (Validation.detectSqlInjection(name)) {
                Validation.showError(name, 'Suspicious input patterns detected!');
                GT.toast('Suspicious input blocked!', 'error');
                return false;
            }

            if (!isValid) {
                GT.toast('Please fill all required fields correctly', 'error');
                return false;
            }

            return true;
        }

        $(document).ready(function() {
            // Apply formatting/sanitization on typing
            $(document).on('input', '#addCatName, #editCategoryName', function() {
                // Alphanumeric, spaces, hyphens
                let value = $(this).val();
                value = value.replace(/[^a-zA-Z0-9\s\-]/g, '');
                $(this).val(value);
            });

            // Bind submit events
            $('#addCatForm').on('submit', function(e) {
                if (!validateCategoryForm('addCatForm')) {
                    e.preventDefault();
                }
            });
            $('#editCategoryForm').on('submit', function(e) {
                if (!validateCategoryForm('editCategoryForm')) {
                    e.preventDefault();
                }
            });
        });
    </script>
    @endpush
</x-app-layout>
