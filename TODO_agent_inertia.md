# TODO - Convert Agent Blade Views to Inertia

## Information gathered
- Agent currently uses Blade views:
  - `resources/views/agent/dashboard.blade.php`
  - `resources/views/agent/invoices/index.blade.php`
  - `resources/views/agent/invoices/create.blade.php`
  - `resources/views/agent/invoices/show.blade.php`
- Agent controllers currently return Blade:
  - `app/Http/Controllers/Agent/DashboardController.php`
  - `app/Http/Controllers/Agent/InvoiceController.php`
  - `app/Http/Controllers/Agent/CustomerController.php`
- Admin views are already Inertia/React:
  - `resources/js/Pages/Admin/Dashboard.jsx`
  - `resources/js/Pages/Admin/Invoices.jsx`
  - `resources/js/Pages/Admin/CreateInvoice.jsx`
  - `resources/js/Pages/Admin/ShowInvoice.jsx`
- Shared UI/Layouts are built for Inertia:
  - `resources/js/Layouts/AppLayout.jsx`
  - `resources/js/Components/Sidebar.jsx` already has agent menu paths `/agent/dashboard` and `/agent/invoices`.

## Plan (file-by-file)
### 1) Add Agent Inertia pages
Create these files under `resources/js/Pages/Agent/`:
- `Agent/Dashboard.jsx`
- `Agent/Invoices.jsx`
- `Agent/CreateInvoice.jsx`
- `Agent/ShowInvoice.jsx`

Implementation details:
- Copy the structure/styles from the corresponding Admin Inertia pages.
- Adjust URLs and data shape to match Agent Blade/controller output.
- Keep the invoice create form identical to Admin CreateInvoice (same validation + calculation logic) but use agent endpoints:
  - invoice index/create/store
  - customers data endpoint `/agent/customers/{customer}/data`
  - quick customer create endpoint `/agent/customers`.

### 2) Update Agent controllers to return Inertia
Modify:
- `app/Http/Controllers/Agent/DashboardController.php`
- `app/Http/Controllers/Agent/InvoiceController.php`
- (optionally) any other agent controller needed

Implementation details:
- Use `Inertia\Inertia` to render new React pages.
- Provide props required by pages:
  - Dashboard: `{ stats, recentInvoices }`
  - Invoices index: `{ invoices }`
  - CreateInvoice: `{ customers, products, areas: [] (or actual areas if agent needs it), settings }` if required by the page.
  - ShowInvoice: `{ invoice, settings }`

### 3) Ensure Agent routes remain the same
Update nothing initially unless route names/paths mismatch. Confirm that route paths are:
- `/agent/dashboard`
- `/agent/invoices`
- `/agent/invoices/create`
- `/agent/invoices/{invoice}`

### 4) Add any missing shared resources
If any props used by Admin pages don’t exist for Agent, either:
- compute them in Agent controller (e.g., `settings`, `currency_symbol`)
- or adapt the Agent page to not require them.

### 5) UI consistency with Admin
- Reuse `AppLayout` and `CustomTable` as Admin does.
- Match AntD components styling and print behavior from Admin ShowInvoice.

## Dependent Files to be edited
- `resources/js/Pages/Agent/Dashboard.jsx` (new)
- `resources/js/Pages/Agent/Invoices.jsx` (new)
- `resources/js/Pages/Agent/CreateInvoice.jsx` (new)
- `resources/js/Pages/Agent/ShowInvoice.jsx` (new)
- `app/Http/Controllers/Agent/DashboardController.php`
- `app/Http/Controllers/Agent/InvoiceController.php`
- (verify) `routes/web.php`

## Followup steps
1. Run `npm run build` (or `npm run dev`) to ensure frontend compiles.
2. Run `php artisan route:list | findstr agent` to confirm routes.
3. Open:
   - `/agent/dashboard`
   - `/agent/invoices`
   - `/agent/invoices/create`
   - `/agent/invoices/{id}`
4. Validate creating invoice still works (POST/validation/invoice items creation).
5. Validate print works on ShowInvoice.

<ask_followup_question>
Reply with “proceed” to implement the plan. If you want the agent create form to also include Areas selection, confirm agent areas source (currently no agent areas passed in controller).
</ask_followup_question>

