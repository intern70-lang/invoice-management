<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings', [
            'settings' => SystemSetting::get(),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate(
            ValidationRules::settings(),
            ValidationRules::settingsMessages()
        );

        $settings = SystemSetting::get();

        $data = $request->except('logo');

        if ($request->hasFile('logo')) {

            if ($settings->logo) {
                Storage::disk('public')
                    ->delete($settings->logo);
            }

            $data['logo'] = $request
                ->file('logo')
                ->store('logos', 'public');
        }

        $settings->update($data);

        return back()->with(
            'success',
            'Settings saved successfully.'
        );
    }
}