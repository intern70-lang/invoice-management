# TODO - Agent Paid/Unpaid + Delete Features

- [ ] Inspect current agent invoice routes and controllers
- [ ] Update `app/Http/Controllers/Agent/InvoiceController.php`:
  - [ ] Add `updateStatus()` for paid/unpaid with ownership check
  - [ ] Add `destroy()` for delete with ownership check
- [ ] Update `routes/web.php` to add agent endpoints:
  - [ ] PATCH `/agent/invoices/{invoice}/status`
  - [ ] DELETE `/agent/invoices/{invoice}`
- [ ] Update `resources/js/Pages/Agent/Invoices.jsx`:
  - [ ] Enable delete Popconfirm UI
- [ ] Update `resources/js/Pages/Agent/ShowInvoice.jsx`:
  - [ ] Add mark paid/unpaid button(s)
- [ ] Verify agent dashboard/login already filters invoices (no extra changes unless needed)
- [ ] Manual test: create invoice → mark paid/unpaid → delete

