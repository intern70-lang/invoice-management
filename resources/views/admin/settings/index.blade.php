<x-app-layout title="System Settings">
    <div class="max-w-2xl">
        <div class="mb-5">
            <h2 class="text-base font-semibold text-white">System Settings</h2>
            <p class="text-xs text-slate-500 mt-0.5">Configure your application settings</p>
        </div>

        <form action="{{ route('admin.settings.update') }}" method="POST" enctype="multipart/form-data">
            @csrf @method('PUT')

            <div class="card p-5 mb-4">
                <h3 class="text-sm font-semibold text-white mb-4">Application Info</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">App Name <span class="text-red-400">*</span></label>
                        <input type="text" name="app_name" value="{{ old('app_name', $settings->app_name) }}"
                               class="input @error('app_name') is-invalid @enderror"
                               data-validate="alphanumeric" required>
                        @error('app_name')<span class="field-error">{{ $message }}</span>@enderror
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Logo</label>
                        @if($settings->logo)
                            <div class="mb-2">
                                <img src="{{ Storage::url($settings->logo) }}" alt="Logo" class="h-12 rounded">
                            </div>
                        @endif
                        <input type="file" name="logo" class="input py-1.5" accept="image/png,image/jpg,image/jpeg">
                        @error('logo')<span class="field-error">{{ $message }}</span>@enderror
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Address</label>
                        <textarea name="address" rows="2" class="input resize-none @error('address') is-invalid @enderror">{{ old('address', $settings->address) }}</textarea>
                        @error('address')<span class="field-error">{{ $message }}</span>@enderror
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                        <input type="text" name="phone" value="{{ old('phone', $settings->phone) }}"
                               class="input @error('phone') is-invalid @enderror"
                               data-validate="phone" placeholder="+44 20 0000 0000">
                        @error('phone')<span class="field-error">{{ $message }}</span>@enderror
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                        <input type="email" name="email" value="{{ old('email', $settings->email) }}"
                               class="input @error('email') is-invalid @enderror"
                               placeholder="info@example.com">
                        @error('email')<span class="field-error">{{ $message }}</span>@enderror
                    </div>
                </div>
            </div>

            <div class="card p-5 mb-5">
                <h3 class="text-sm font-semibold text-white mb-4">Bank Details</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">Bank Name</label>
                        <input type="text" name="bank_name" value="{{ old('bank_name', $settings->bank_name) }}"
                               class="input @error('bank_name') is-invalid @enderror"
                               placeholder="e.g. Barclays Bank">
                        @error('bank_name')<span class="field-error">{{ $message }}</span>@enderror
                    </div>
                    <div class="col-span-2">
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">IBAN</label>
                        <input type="text" name="iban" value="{{ old('iban', $settings->iban) }}"
                               class="input @error('iban') is-invalid @enderror"
                               placeholder="GB29NWBK60161331926819" data-validate="iban">
                        @error('iban')<span class="field-error">{{ $message }}</span>@enderror
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1.5">SWIFT / BIC</label>
                        <input type="text" name="swift_code" value="{{ old('swift_code', $settings->swift_code) }}"
                               class="input @error('swift_code') is-invalid @enderror"
                               placeholder="NWBKGB2L" data-validate="iban">
                        @error('swift_code')<span class="field-error">{{ $message }}</span>@enderror
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit" class="btn btn-primary">Save Settings</button>
            </div>
        </form>
    </div>
</x-app-layout>
