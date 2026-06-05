<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use App\Models\SystemSetting;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => Auth::user(),
            ],

            // Support both new Inertia-style keys and legacy blade keys
            'flash' => [
                'success' => fn () => $request->session()->get('success')
                                   ?? $request->session()->get('toast_success'),
                'error'   => fn () => $request->session()->get('error')
                                   ?? $request->session()->get('toast_error'),
                'info'    => fn () => $request->session()->get('info')
                                   ?? $request->session()->get('toast_info'),
            ],

            // ✅ Add system settings globally
            'settings' => SystemSetting::get(),
        ];
    }
}