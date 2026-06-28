import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Drawer, DrawerHeader, DrawerItems, Label, Select, Textarea, TextInput } from "flowbite-react";
import { LuPlus, LuReceipt } from "react-icons/lu";
import { API } from "src/API/api";
import { fmtDate, fmtMoney, statusClass, titleCase, fromDateInput, toDateInput } from "src/utils/ui";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const CATEGORIES = ["travel", "food", "accommodation", "supplies", "software", "training", "other"];

const emptyForm = () => ({ title: "", category: "travel", amount: "", date: toDateInput(Math.floor(Date.now() / 1000)), description: "", receiptUrl: "" });

const Reimbursements = () => {
  const user = useSelector((s) => s.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const load = () => {
    setLoading(true);
    API.expense
      .list({ employee: user?._id, limit: 50 })
      .then((res) => setItems(res?.data?.expenses?.items || res?.data?.expenses || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?._id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.title.trim() || !form.amount) {
      dispatchSnackbar("Title and amount are required", snackBarTypes.failure);
      return;
    }
    setSaving(true);
    try {
      const res = await API.expense.create({
        employee: user._id,
        title: form.title,
        category: form.category,
        amount: Number(form.amount),
        date: fromDateInput(form.date) || Math.floor(Date.now() / 1000),
        description: form.description || "",
        receiptUrl: form.receiptUrl || "",
      });
      if (res?.success) {
        dispatchSnackbar("Reimbursement request submitted", snackBarTypes.success);
        setOpen(false);
        setForm(emptyForm());
        load();
      } else {
        dispatchSnackbar(res?.message || "Could not submit request", snackBarTypes.failure);
      }
    } catch (e) {
      dispatchSnackbar(e?.message || "Something went wrong", snackBarTypes.failure);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reimbursements</h1>
          <p className="text-sm text-gray-400">Request reimbursement and track approval.</p>
        </div>
        <Button color="blue" onClick={() => setOpen(true)}>
          <LuPlus className="mr-2" /> Request
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-gray-300">
            <LuReceipt size="2rem" />
            <p className="text-sm">No reimbursement requests yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {items.map((e) => (
              <li key={e._id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{e.title}</p>
                  <p className="truncate text-xs text-gray-400">
                    {titleCase(e.category)} · {fmtDate(e.date)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{fmtMoney(e.amount, e.currency || "AED")}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass(e.status)}`}>{e.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Drawer className="w-full max-w-[600px] z-100" open={open} onClose={() => setOpen(false)} position="right">
        <DrawerHeader title="Request Reimbursement" titleIcon={() => null} />
        <DrawerItems>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <TextInput id="title" value={form.title} onChange={set("title")} placeholder="e.g. Client visit taxi" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select id="category" value={form.category} onChange={set("category")} className="mt-1">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {titleCase(c)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount (AED)</Label>
                <TextInput id="amount" type="number" min="0" value={form.amount} onChange={set("amount")} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <TextInput id="date" type="date" value={form.date} onChange={set("date")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="receiptUrl">Receipt URL (optional)</Label>
              <TextInput id="receiptUrl" value={form.receiptUrl} onChange={set("receiptUrl")} placeholder="https://..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={form.description} onChange={set("description")} className="mt-1" />
            </div>
            <Button color="blue" onClick={submit} isProcessing={saving} disabled={saving} className="w-full">
              Submit request
            </Button>
          </div>
        </DrawerItems>
      </Drawer>
    </div>
  );
};

export default Reimbursements;
