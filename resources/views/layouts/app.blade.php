<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? config('app.name') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Select2 -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet"/>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter','sans-serif'] },
                    colors: {
                        surface: { 900:'#0f1117', 800:'#161b27', 700:'#1e2535', 600:'#252d3f', 500:'#2e3850' },
                        accent:  { DEFAULT:'#4f8ef7', hover:'#3b7de8', light:'#e8f0fe' }
                    }
                }
            }
        }
    </script>
    <style>
        body { background:#0f1117; color:#e2e8f0; font-family:'Inter',sans-serif; }
        .sidebar { width:240px; transition:width .25s ease; }
        .sidebar.collapsed { width:64px; }
        .sidebar.collapsed .nav-label,
        .sidebar.collapsed .sidebar-header-text,
        .sidebar.collapsed .sidebar-footer { display:none; }
        .sidebar.collapsed .nav-item { justify-content:center; padding:.625rem; }
        .main-content { margin-left:240px; transition:margin-left .25s ease; }
        .main-content.expanded { margin-left:64px; }
        .nav-item { display:flex; align-items:center; gap:.75rem; padding:.625rem .75rem; border-radius:.5rem;
                    color:#94a3b8; transition:all .15s ease; cursor:pointer; text-decoration:none; font-size:.875rem; }
        .nav-item:hover,.nav-item.active { background:#252d3f; color:#e2e8f0; }
        .nav-item.active { color:#4f8ef7; }

        /* Modal */
        .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:50; display:none; align-items:center; justify-content:center; }
        .modal-backdrop.open { display:flex; }
        .modal-box { background:#1e2535; border-radius:.75rem; padding:1.5rem; width:100%; max-width:520px;
                     border:1px solid #252d3f; box-shadow:0 25px 50px rgba(0,0,0,.5); max-height:90vh; overflow-y:auto; }

        /* Inputs */
        .input { background:#161b27; border:1px solid #252d3f; color:#e2e8f0; border-radius:.5rem;
                 padding:.5rem .75rem; font-size:.875rem; width:100%; outline:none; transition:border-color .15s; }
        .input:focus { border-color:#4f8ef7; }
        .input::placeholder { color:#475569; }
        .input.is-invalid { border-color:#ef4444 !important; }
        select.input option { background:#161b27; }
        .field-error { color:#f87171; font-size:.75rem; margin-top:.25rem; display:block; }

        /* Buttons */
        .btn { display:inline-flex; align-items:center; gap:.5rem; padding:.5rem 1rem; border-radius:.5rem;
               font-size:.875rem; font-weight:500; cursor:pointer; transition:all .15s; border:none; }
        .btn-primary   { background:#4f8ef7; color:#fff; }
        .btn-primary:hover { background:#3b7de8; }
        .btn-secondary { background:#252d3f; color:#94a3b8; }
        .btn-secondary:hover { background:#2e3850; color:#e2e8f0; }
        .btn-danger    { background:#dc2626; color:#fff; }
        .btn-danger:hover { background:#b91c1c; }
        .btn-ghost     { background:transparent; color:#94a3b8; }
        .btn-ghost:hover { background:#252d3f; color:#e2e8f0; }

        /* Badges */
        .badge-active   { background:#052e16; color:#4ade80; padding:.2rem .5rem; border-radius:99px; font-size:.75rem; }
        .badge-inactive { background:#450a0a; color:#f87171; padding:.2rem .5rem; border-radius:99px; font-size:.75rem; }

        /* Card / table */
        .card { background:#161b27; border:1px solid #1e2535; border-radius:.75rem; }
        .table-row { border-bottom:1px solid #1e2535; }
        .table-row:last-child { border-bottom:none; }
        .table-row:hover { background:#1e2535; }

        /* Toggle */
        .toggle { position:relative; width:40px; height:22px; }
        .toggle input { opacity:0; width:0; height:0; }
        .toggle-slider { position:absolute; inset:0; background:#374151; border-radius:99px; cursor:pointer; transition:.3s; }
        .toggle-slider:before { content:''; position:absolute; height:16px; width:16px; left:3px; bottom:3px; background:#fff; border-radius:50%; transition:.3s; }
        .toggle input:checked + .toggle-slider { background:#4f8ef7; }
        .toggle input:checked + .toggle-slider:before { transform:translateX(18px); }

        /* ── Toast ─────────────────────────────────────────────────────────── */
        #toast-container { position:fixed; top:1.25rem; right:1.25rem; z-index:9999; display:flex; flex-direction:column; gap:.5rem; pointer-events:none; }
        .toast { display:flex; align-items:flex-start; gap:.75rem; padding:.875rem 1rem; border-radius:.625rem;
                 min-width:280px; max-width:380px; box-shadow:0 8px 24px rgba(0,0,0,.4);
                 pointer-events:all; animation:toastIn .3s ease; font-size:.8125rem; line-height:1.4; }
        .toast.hide { animation:toastOut .3s ease forwards; }
        .toast-success { background:#0d2318; border:1px solid #166534; color:#4ade80; }
        .toast-error   { background:#1f0808; border:1px solid #991b1b; color:#f87171; }
        .toast-info    { background:#0c1a2e; border:1px solid #1d4ed8; color:#93c5fd; }
        .toast-icon    { width:16px; height:16px; flex-shrink:0; margin-top:1px; }
        .toast-close   { margin-left:auto; background:none; border:none; cursor:pointer; opacity:.6; padding:0; color:inherit; flex-shrink:0; }
        .toast-close:hover { opacity:1; }
        @keyframes toastIn  { from { opacity:0; transform:translateX(1rem); } to { opacity:1; transform:translateX(0); } }
        @keyframes toastOut { from { opacity:1; transform:translateX(0); }    to { opacity:0; transform:translateX(1rem); } }

        /* ── Select2 dark theme ─────────────────────────────────────────────── */
        .select2-container--default .select2-selection--single {
            background:#161b27; border:1px solid #252d3f; border-radius:.5rem; height:36px; color:#e2e8f0; }
        .select2-container--default .select2-selection--single .select2-selection__rendered {
            color:#e2e8f0; line-height:34px; padding-left:.75rem; font-size:.875rem; }
        .select2-container--default .select2-selection--single .select2-selection__arrow { height:34px; right:6px; }
        .select2-container--default .select2-selection--single .select2-selection__arrow b {
            border-color:#64748b transparent transparent; }
        .select2-container--default.select2-container--open .select2-selection--single .select2-selection__arrow b {
            border-color:transparent transparent #64748b; }
        .select2-dropdown { background:#1e2535; border:1px solid #252d3f; border-radius:.5rem; box-shadow:0 10px 30px rgba(0,0,0,.4); }
        .select2-container--default .select2-search--dropdown .select2-search__field {
            background:#161b27; border:1px solid #252d3f; color:#e2e8f0; border-radius:.375rem; padding:.375rem .5rem; font-size:.8125rem; }
        .select2-container--default .select2-results__option { color:#94a3b8; font-size:.8125rem; padding:.5rem .75rem; }
        .select2-container--default .select2-results__option--highlighted { background:#252d3f; color:#e2e8f0; }
        .select2-container--default .select2-results__option--selected { background:#1a2a4a; color:#4f8ef7; }
        .select2-container--default .select2-selection--single.is-invalid { border-color:#ef4444 !important; }
        .select2-container { width:100% !important; }

        @media print {
            .sidebar,.topbar,.no-print { display:none!important; }
            .main-content { margin-left:0!important; }
        }

        /* width */
        ::-webkit-scrollbar {
        width: 6px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
        background: #161b27;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
        background: #4f8ef7;
        border-radius: 5px;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
        background: #555;
        }
    </style>
    @stack('styles')
</head>
<body class="overflow-hidden">

<!-- Toast Container -->
<div id="toast-container"></div>

<!-- Sidebar -->
<aside id="sidebar" class="sidebar fixed top-0 left-0 h-screen bg-surface-800 border-r border-surface-700 flex flex-col z-40 overflow-hidden">
    <div class="flex items-center gap-3 px-4 py-5 border-b border-surface-700 min-h-[65px]">
        <div class="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <span class="sidebar-header-text font-semibold text-white text-sm">InvoiceApp</span>
    </div>
    <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
        @if(auth()->user()->isAdmin())
            <a href="{{ route('admin.dashboard') }}"   class="nav-item {{ request()->routeIs('admin.dashboard')   ? 'active':'' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
                <span class="nav-label">Dashboard</span>
            </a>
            <a href="{{ route('admin.invoices.index') }}" class="nav-item {{ request()->routeIs('admin.invoices*') ? 'active':'' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span class="nav-label">Invoices</span>
            </a>
            <a href="{{ route('admin.customers.index') }}" class="nav-item {{ request()->routeIs('admin.customers*') ? 'active':'' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span class="nav-label">Customers</span>
            </a>
            <a href="{{ route('admin.products.index') }}" class="nav-item {{ request()->routeIs('admin.products*') ? 'active':'' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <span class="nav-label">Products</span>
            </a>
            <a href="{{ route('admin.categories.index') }}" class="nav-item {{ request()->routeIs('admin.categories*') ? 'active':'' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                <span class="nav-label">Categories</span>
            </a>
            <a href="{{ route('admin.settings.index') }}" class="nav-item {{ request()->routeIs('admin.settings*') ? 'active':'' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span class="nav-label">Settings</span>
            </a>
        @else
            <a href="{{ route('agent.dashboard') }}"      class="nav-item {{ request()->routeIs('agent.dashboard')   ? 'active':'' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
                <span class="nav-label">Dashboard</span>
            </a>
            <a href="{{ route('agent.invoices.index') }}" class="nav-item {{ request()->routeIs('agent.invoices*')   ? 'active':'' }}">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span class="nav-label">Invoices</span>
            </a>
        @endif
    </nav>
    <div class="sidebar-footer p-3 border-t border-surface-700">
        <div class="flex items-center gap-3 px-2 py-2">
            <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {{ strtoupper(substr(auth()->user()->name,0,1)) }}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-white truncate">{{ auth()->user()->name }}</p>
                <p class="text-xs text-slate-500 capitalize">{{ auth()->user()->role }}</p>
            </div>
            <form action="{{ route('logout') }}" method="POST" data-confirm="Are you sure you want to logout?">
                @csrf
                <button type="submit" class="btn btn-ghost p-1" title="Logout">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                </button>
            </form>
        </div>
    </div>
</aside>

<!-- Main -->
<div id="main-content" class="main-content min-h-screen overflow-y-auto max-h-[calc(100vh-65px)] flex flex-col">
    <header class="topbar bg-surface-800 border-b border-surface-700 px-6 py-4 min-h-[73px] flex items-center gap-4 sticky top-0 z-10">
        <button id="sidebar-toggle" class="btn btn-ghost p-2 -ml-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <h1 class="text-sm font-semibold text-white">{{ $title ?? 'Dashboard' }}</h1>
        <div class="ml-auto flex items-center gap-3">
            @if(auth()->user()->isAdmin())
                <a href="{{ route('admin.invoices.create') }}" class="btn btn-primary text-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>New Invoice
                </a>
            @else
                <a href="{{ route('agent.invoices.create') }}" class="btn btn-primary text-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>New Invoice
                </a>
            @endif
        </div>
    </header>
    <main class="flex-1 p-6">
        {{ $slot }}
    </main>
</div>

<script>
// ── Form Validation Utility ──────────────────────────────────────────────────
window.Validation = {
    showError: function (input, message) {
        const $el = $(input);
        $el.addClass('border-red-500 is-invalid');

        if ($el.hasClass('select2-hidden-accessible')) {
            const $select2Container = $el.next('.select2-container');
            if ($select2Container.length) {
                $select2Container.find('.select2-selection--single, .select2-selection--multiple').addClass('is-invalid border-red-500');
            }
        }

        let $err = $el.siblings('.error-message, .field-error');
        if ($err.length === 0) $err = $el.parent().siblings('.error-message, .field-error');
        if ($err.length === 0) $err = $el.closest('div').siblings('.error-message, .field-error');

        if ($err.length === 0) {
            $err = $('<span class="field-error"></span>');
            $el.parent().append($err);
        }

        if ($err.length) {
            $err.removeClass('hidden').text(message);
        }
    },

    clearError: function (input) {
        const $el = $(input);
        $el.removeClass('border-red-500 is-invalid');

        if ($el.hasClass('select2-hidden-accessible')) {
            const $select2Container = $el.next('.select2-container');
            if ($select2Container.length) {
                $select2Container.find('.select2-selection--single, .select2-selection--multiple').removeClass('is-invalid border-red-500');
            }
        }

        let $err = $el.siblings('.error-message, .field-error');
        if ($err.length === 0) $err = $el.parent().siblings('.error-message, .field-error');
        if ($err.length === 0) $err = $el.closest('div').siblings('.error-message, .field-error');

        if ($err.length) {
            $err.addClass('hidden').text('');
        }
    },

    required: function (input, message = 'This field is required') {
        const value = $(input).val().trim();
        if (value === '') {
            this.showError(input, message);
            return false;
        }
        this.clearError(input);
        return true;
    },

    email: function (input, message = 'Invalid email address') {
        const value = $(input).val().trim();
        if (value === '') {
            this.clearError(input);
            return true;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
            this.showError(input, message);
            return false;
        }
        this.clearError(input);
        return true;
    },

    allowOnlyLetters: function (input) {
        let value = $(input).val();
        value = value.replace(/[^a-zA-Z\s]/g, '');
        $(input).val(value);
    },

    allowOnlyNumbers: function (input) {
        let value = $(input).val();
        value = value.replace(/[^0-9]/g, '');
        $(input).val(value);
    },

    allowDecimalNumbers: function (input) {
        let value = $(input).val();
        value = value.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        $(input).val(value);
    },

    propertyAddress: function (input) {
        let value = $(input).val();
        value = value.replace(/[^a-zA-Z0-9\s,\-#.]/g, '');
        $(input).val(value);
    },

    descriptionText: function (input) {
        let value = $(input).val();
        value = value.replace(/[<>`]/g, '');
        $(input).val(value);
    },

    detectSqlInjection: function (input) {
        const value = $(input).val();
        if (!value) return false;
        const sqlPatterns = [
            /UNION\s+SELECT/i,
            /SELECT\s+.*\s+FROM/i,
            /INSERT\s+INTO/i,
            /UPDATE\s+.*\s+SET/i,
            /DELETE\s+FROM/i,
            /DROP\s+TABLE/i,
            /OR\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
            /--/,
            /\/\*/
        ];
        for (let pattern of sqlPatterns) {
            if (pattern.test(value)) return true;
        }
        return false;
    }
};

window.GT = {
    toast: function(message, type = 'success') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log('Toast:', type, message);
        }
    }
};

// ── Sidebar ──────────────────────────────────────────────────────────────────
const sidebar = document.getElementById('sidebar');
const main    = document.getElementById('main-content');
let collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
function applySidebar() {
    sidebar.classList.toggle('collapsed', collapsed);
    main.classList.toggle('expanded', collapsed);
}
applySidebar();
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    collapsed = !collapsed;
    localStorage.setItem('sidebar-collapsed', collapsed);
    applySidebar();
});

// ── Toast System ─────────────────────────────────────────────────────────────
function showToast(message, type = 'success', duration = 4000) {
    const container = document.getElementById('toast-container');
    const icons = {
        success: `<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
        error:   `<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
        info:    `<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    };
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `${icons[type] || icons.info}<span>${message}</span><button class="toast-close" onclick="dismissToast(this.parentElement)"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>`;
    container.appendChild(t);
    setTimeout(() => dismissToast(t), duration);
}
function dismissToast(el) {
    if (!el || el.classList.contains('hide')) return;
    el.classList.add('hide');
    setTimeout(() => el.remove(), 300);
}

// ── Fire server-side toasts ──────────────────────────────────────────────────
@if(session('toast_success'))
    document.addEventListener('DOMContentLoaded', () => showToast(`{!! session('toast_success') !!}`, 'success'));
@endif
@if(session('toast_error'))
    document.addEventListener('DOMContentLoaded', () => showToast(`{!! session('toast_error') !!}`, 'error'));
@endif
@if(session('toast_info'))
    document.addEventListener('DOMContentLoaded', () => showToast(`{!! session('toast_info') !!}`, 'info'));
@endif

// ── Show validation errors as toast + mark fields ────────────────────────────
@if($errors->any())
    document.addEventListener('DOMContentLoaded', () => {
        showToast('Please fix the errors below.', 'error');
    });
@endif

// ── Global input key restrictions ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Alpha only (letters + space + hyphen + apostrophe + dot)
    document.querySelectorAll('[data-validate="alpha"]').forEach(el => {
        el.addEventListener('keypress', e => {
            if (!/^[a-zA-Z\s\-\'\.]+$/.test(e.key)) e.preventDefault();
        });
        el.addEventListener('paste', e => {
            const text = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^[a-zA-Z\s\-\'\.]+$/.test(text)) e.preventDefault();
        });
    });
    // Alphanumeric (letters + numbers + space + hyphen + parentheses)
    document.querySelectorAll('[data-validate="alphanumeric"]').forEach(el => {
        el.addEventListener('keypress', e => {
            if (!/^[a-zA-Z0-9\s\-\(\)]+$/.test(e.key)) e.preventDefault();
        });
        el.addEventListener('paste', e => {
            const text = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^[a-zA-Z0-9\s\-\(\)]+$/.test(text)) e.preventDefault();
        });
    });
    // Numbers only — no e, no +/-, no dot (integer)
    document.querySelectorAll('[data-validate="integer"]').forEach(el => {
        el.addEventListener('keydown', e => {
            const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'];
            if (allowed.includes(e.key)) return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
        });
        el.addEventListener('paste', e => {
            const text = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^\d+$/.test(text)) e.preventDefault();
        });
    });
    // Decimal — digits + single dot, no e
    document.querySelectorAll('[data-validate="decimal"]').forEach(el => {
        el.addEventListener('keydown', e => {
            const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'];
            if (allowed.includes(e.key)) return;
            if (e.key === '.' && !el.value.includes('.')) return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
        });
        el.addEventListener('paste', e => {
            const text = (e.clipboardData || window.clipboardData).getData('text');
            if (!/^\d+(\.\d{0,2})?$/.test(text)) e.preventDefault();
        });
    });
    // Phone — digits + spaces + + - ( )
    document.querySelectorAll('[data-validate="phone"]').forEach(el => {
        el.addEventListener('keypress', e => {
            if (!/^[\d\s\+\-\(\)]$/.test(e.key)) e.preventDefault();
        });
    });
    // Uppercase alphanumeric (IBAN / SWIFT)
    document.querySelectorAll('[data-validate="iban"]').forEach(el => {
        el.addEventListener('keypress', e => {
            if (!/^[a-zA-Z0-9]$/.test(e.key)) e.preventDefault();
        });
        el.addEventListener('input', () => { el.value = el.value.toUpperCase(); });
    });
});

// ── Inline field error helper (used by forms) ─────────────────────────────────
function setFieldError(el, msg) {
    el.classList.add('is-invalid');
    let err = el.parentElement.querySelector('.field-error');
    if (!err) { err = document.createElement('span'); err.className = 'field-error'; el.parentElement.appendChild(err); }
    err.textContent = msg;
}
function clearFieldError(el) {
    el.classList.remove('is-invalid');
    const err = el.parentElement.querySelector('.field-error');
    if (err) err.remove();
}
// Auto-clear on input
document.addEventListener('input', e => {
    if (e.target.classList.contains('is-invalid') || e.target.classList.contains('border-red-500')) {
        window.Validation.clearError(e.target);
    }
});
document.addEventListener('change', e => {
    if (e.target.classList.contains('is-invalid') || e.target.classList.contains('border-red-500')) {
        window.Validation.clearError(e.target);
    }
});

// ── Global Form Submit Loading Indicator ─────────────────────────────────────
$(document).on('submit', 'form', function (e) {
    if (e.isDefaultPrevented()) return;

    const $form = $(this);
    
    // Disable checkbox toggles to prevent double submit
    $form.find('input[type="checkbox"]').prop('disabled', true);
    
    const $submitBtn = $form.find('button[type="submit"]');
    if ($submitBtn.length && !$submitBtn.hasClass('is-loading')) {
        $submitBtn.addClass('is-loading').prop('disabled', true);
        
        // Loader SVG spinner (using Tailwind's animate-spin class)
        const spinner = `<svg class="animate-spin h-3.5 w-3.5 text-white inline-block mr-1.5 align-middle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
        
        $submitBtn.prepend(spinner);
        
        // Disable other buttons in the form (like Cancel) to prevent cancellation mid-request
        $form.find('button').not($submitBtn).prop('disabled', true);
    }
});
</script>

    <!-- Global Confirmation Modal -->
    <div id="globalConfirmModal" class="modal-backdrop">
        <div class="modal-box max-w-[300px]">
            <div class="w-full flex flex-col items-center justify-center text-center mb-4">
                <div class="bg-red-100/10 p-2 rounded-md mb-4">
                    <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
            <p id="globalConfirmMessage" class="mb-4 text-sm text-gray-200"></p>
        </div>
            <div class="flex items-center justify-center gap-2">
                <button id="globalConfirmCancel" class="btn btn-secondary">Cancel</button>
                <button id="globalConfirmOk" class="btn btn-danger">Delete</button>
            </div>
        </div>
    </div>

    <script>
        // Global confirmation modal logic
        (function() {
            let confirmCallback = null;
            const modal = document.getElementById('globalConfirmModal');
            const messageEl = document.getElementById('globalConfirmMessage');
            const okBtn = document.getElementById('globalConfirmOk');
            const cancelBtn = document.getElementById('globalConfirmCancel');

            function openConfirm(message, callback) {
                messageEl.textContent = message;
                confirmCallback = callback;
                modal.classList.add('open');
            }

            function closeConfirm() {
                modal.classList.remove('open');
                confirmCallback = null;
            }

            okBtn.addEventListener('click', function() {
                if (typeof confirmCallback === 'function') {
                    confirmCallback();
                }
                closeConfirm();
            });
            cancelBtn.addEventListener('click', closeConfirm);

            // Attach to forms with data-confirm attribute
            document.addEventListener('submit', function(e) {
                const form = e.target;
                const confirmMsg = form.getAttribute('data-confirm');
                if (confirmMsg) {
                    e.preventDefault();
                    openConfirm(confirmMsg, function() { form.submit(); });
                }
            }, true);
        })();
    </script>

</html>
@stack('scripts')
</body>
</html>
