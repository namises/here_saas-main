import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label, TextInput } from "flowbite-react";
import { LuMail, LuPhone, LuBriefcase, LuIdCard, LuCalendarDays } from "react-icons/lu";
import { API } from "src/API/api";
import { updateUser } from "src/redux/reducers/user";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";
import { fmtDate } from "src/utils/ui";

const ReadOnly = ({ Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900/40">
    <Icon className="text-gray-400" size="1.1rem" />
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{value || "—"}</p>
    </div>
  </div>
);

const MyProfile = () => {
  const user = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    photo: user?.photo || "",
    bankAccount: user?.bankAccount || "",
    ifsc: user?.ifsc || "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      // Only send self-editable fields; backend allows updateOwn on the logged-in employee.
      const payload = { employeeId: user._id, name: form.name, mobile: form.mobile || undefined, photo: form.photo || undefined, bankAccount: form.bankAccount || undefined, ifsc: form.ifsc || undefined };
      const res = await API.employee.update(payload);
      if (res?.success) {
        dispatch(updateUser({ name: form.name, mobile: form.mobile, photo: form.photo, bankAccount: form.bankAccount, ifsc: form.ifsc }));
        dispatchSnackbar("Profile updated", snackBarTypes.success);
      } else {
        dispatchSnackbar(res?.message || "Could not update profile", snackBarTypes.failure);
      }
    } catch (e) {
      dispatchSnackbar(e?.message || "Something went wrong", snackBarTypes.failure);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Identity header */}
      <div className="mb-5 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
        <img className="h-20 w-20 rounded-2xl object-cover ring-2 ring-blue-100 dark:ring-blue-900" src={form.photo || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} alt="profile" />
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">{user?.name}</h1>
          <p className="text-sm text-gray-400">{user?.designation || "Employee"}</p>
          {user?.empCode ? <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">#{user.empCode}</span> : null}
        </div>
      </div>

      {/* Read-only info */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ReadOnly Icon={LuMail} label="Email" value={user?.email} />
        <ReadOnly Icon={LuBriefcase} label="Designation" value={user?.designation} />
        <ReadOnly Icon={LuIdCard} label="PAN" value={user?.pan} />
        <ReadOnly Icon={LuCalendarDays} label="Joining Date" value={user?.joiningDate ? fmtDate(user.joiningDate) : "—"} />
      </div>

      {/* Editable form */}
      <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-sm font-semibold text-gray-500">Edit details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <TextInput id="name" value={form.name} onChange={set("name")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <TextInput id="mobile" value={form.mobile} onChange={set("mobile")} icon={LuPhone} className="mt-1" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="photo">Photo URL</Label>
            <TextInput id="photo" value={form.photo} onChange={set("photo")} placeholder="https://...jpg" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="bankAccount">Bank account</Label>
            <TextInput id="bankAccount" value={form.bankAccount} onChange={set("bankAccount")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="ifsc">IFSC</Label>
            <TextInput id="ifsc" value={form.ifsc} onChange={set("ifsc")} className="mt-1" />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button color="blue" onClick={save} isProcessing={saving} disabled={saving || !form.name.trim()}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
