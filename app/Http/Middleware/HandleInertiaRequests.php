<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

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

            'flash' => [
                'success' => fn () => $request->session()->get('toast_success'),
                'error'   => fn () => $request->session()->get('toast_error'),
                'info'    => fn () => $request->session()->get('toast_info'),
            ],
        ];
    }
}