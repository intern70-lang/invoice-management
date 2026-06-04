<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — InvoiceApp</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { background:#0f1117; font-family:'Inter',sans-serif; }
        .input { background:#161b27; border:1px solid #252d3f; color:#e2e8f0; border-radius:.5rem;
                 padding:.625rem .75rem; font-size:.875rem; width:100%; outline:none; transition:border-color .15s; }
        .input:focus { border-color:#4f8ef7; }
        .input::placeholder { color:#475569; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
        <div class="text-center mb-8">
            <div class="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
            </div>
            <h1 class="text-xl font-semibold text-white">InvoiceApp</h1>
            <p class="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        <div class="bg-[#161b27] border border-[#1e2535] rounded-xl p-6">
            @if($errors->any())
                <div class="bg-[#450a0a] border border-[#991b1b] text-red-400 rounded-lg p-3 mb-4 text-sm">
                    {{ $errors->first() }}
                </div>
            @endif

            <form action="{{ route('login') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                    <input type="email" name="email" value="{{ old('email') }}"
                           class="input" placeholder="you@example.com" required autofocus>
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                    <input type="password" name="password" class="input" placeholder="••••••••" required>
                </div>
                <div class="flex items-center gap-2">
                    <input type="checkbox" name="remember" id="remember" class="rounded border-slate-600">
                    <label for="remember" class="text-xs text-slate-400">Remember me</label>
                </div>
                <button type="submit"
                        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                    Sign In
                </button>
            </form>
        </div>

        <p class="text-center text-xs text-slate-600 mt-6">
            Demo: admin@example.com / agent@example.com — password: <strong class="text-slate-500">password</strong>
        </p>
    </div>
</body>
</html>
