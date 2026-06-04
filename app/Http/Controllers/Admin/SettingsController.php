<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\ValidationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::get();
        return view('admin.settings.index', compact('settings'));
    }

    public function update(Request $request)
    {
        $request->validate(ValidationRules::settings(), ValidationRules::settingsMessages());
        $settings = SystemSetting::get();
        $data = $request->except('logo');
        if ($request->hasFile('logo')) {
            if ($settings->logo) Storage::disk('public')->delete($settings->logo);
            $data['logo'] = $request->file('logo')->store('logos', 'public');
        }
        $settings->update($data);
        return back()->with('toast_success', 'Settings saved successfully.');
    }
}
