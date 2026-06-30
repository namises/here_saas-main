import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import { LuPhone } from "react-icons/lu";
import { API } from "src/API/api";
import { updateUser } from "src/redux/reducers/user";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";
import ProfileImageUpload from "src/components/ProfileImageUpload";
import EmployeeProfileSections from "src/components/EmployeeProfileSections";
import DateInput from "src/components/DateInput";
import { fmtDate, statusClass, titleCase } from "src/utils/ui";

const MyProfile = () => {
  const user = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    photo: user?.photo || "",
    personalEmail: user?.personalEmail || "",
    alternateMobile: user?.alternateMobile || "",
    gender: user?.gender || "",
    bloodGroup: user?.bloodGroup || "",
    maritalStatus: user?.maritalStatus || "",
    address: user?.address || "",
    bankAccount: user?.bankAccount || "",
    ifsc: user?.ifsc || "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Persist the new photo immediately so it appears in the top-right profile menu right away.
  const changePhoto = async (url) => {
    setForm((f) => ({ ...f, photo: url }));
    const res = await API.employee.update({ employeeId: user._id, photo: url });
    if (res?.success) {
      dispatch(updateUser({ photo: url }));
      dispatchSnackbar("Profile photo updated", snackBarTypes.success);
    } else {
      dispatchSnackbar(res?.message || "Could not update photo", snackBarTypes.failure);
    }
  };

  // ---- Resignation ----
  const resignation = user?.resignation || {};
  const hasActiveResignation = ["submitted", "approved", "completed"].includes(resignation.status);
  const [resignOpen, setResignOpen] = useState(false);
  const [resignSaving, setResignSaving] = useState(false);
  const [resignForm, setResignForm] = useState({ lastWorkingDay: "", reason: "", noticePeriodDays: "" });

  const submitResignation = async (withdraw = false) => {
    setResignSaving(true);
    try {
      const r = withdraw
        ? { status: "withdrawn" }
        : {
            status: "submitted",
            resignedOn: Math.floor(Date.now() / 1000),
            lastWorkingDay: resignForm.lastWorkingDay ? Number(resignForm.lastWorkingDay) : null,
            reason: resignForm.reason || null,
            noticePeriodDays: resignForm.noticePeriodDays === "" ? null : Number(resignForm.noticePeriodDays),
          };
      const res = await API.employee.update({ employeeId: user._id, resignation: r });
      if (res?.success) {
        dispatch(updateUser({ resignation: res.data?.employee?.resignation ?? { ...resignation, ...r } }));
        dispatchSnackbar(withdraw ? "Resignation withdrawn" : "Resignation submitted to your admin", snackBarTypes.success);
        setResignOpen(false);
      } else {
        dispatchSnackbar(res?.message || "Could not submit resignation", snackBarTypes.failure);
      }
    } catch (err) {
      dispatchSnackbar(err?.message || "Something went wrong", snackBarTypes.failure);
    } finally {
      setResignSaving(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      // Only personal fields — the server restricts self-edits to these regardless.
      const enums = ["gender", "maritalStatus"];
      const payload = { employeeId: user._id };
      Object.entries(form).forEach(([k, v]) => {
        if (enums.includes(k)) {
          if (v) payload[k] = v;
        } else {
          payload[k] = v || undefined;
        }
      });
      const res = await API.employee.update(payload);
      if (res?.success) {
        dispatch(updateUser({ ...form }));
        dispatchSnackbar("Profile updated", snackBarTypes.success);
        setEditing(false);
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
    <div className="mx-auto max-w-4xl">
      {/* Identity header */}
      <div className="mb-5 flex flex-col items-center gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row dark:bg-gray-800">
        <ProfileImageUpload value={form.photo} onChange={changePhoto} />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">{user?.name}</h1>
          <p className="text-sm text-gray-400">{user?.designation || "Employee"}</p>
          {user?.empCode ? <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">#{user.empCode}</span> : null}
          <p className="mt-1 text-xs text-gray-400">Upload or snap a new photo — it saves and updates your profile menu instantly.</p>
        </div>
        {!editing ? (
          <Button color="blue" size="sm" onClick={() => setEditing(true)}>
            Edit my details
          </Button>
        ) : null}
      </div>

      {/* Resignation */}
      <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500">Resignation</h2>
          {!hasActiveResignation && !resignOpen ? (
            <Button color="red" size="xs" onClick={() => setResignOpen(true)}>
              Apply for resignation
            </Button>
          ) : null}
        </div>

        {hasActiveResignation ? (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass(resignation.status === "submitted" ? "pending" : resignation.status === "approved" || resignation.status === "completed" ? "approved" : "inactive")}`}>
                {titleCase(resignation.status)}
              </span>
              {resignation.lastWorkingDay ? <span className="text-xs text-gray-400">Last working day: {fmtDate(resignation.lastWorkingDay)}</span> : null}
            </div>
            {resignation.reason ? <p className="text-sm text-gray-500 dark:text-gray-400">Reason: {resignation.reason}</p> : null}
            {resignation.status === "submitted" ? (
              <Button color="gray" size="xs" onClick={() => submitResignation(true)} isProcessing={resignSaving} disabled={resignSaving}>
                Withdraw request
              </Button>
            ) : (
              <p className="text-xs text-gray-400">Your resignation has been {resignation.status} by your admin.</p>
            )}
          </div>
        ) : resignOpen ? (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label>Last working day</Label>
              <DateInput value={resignForm.lastWorkingDay} setter={(v) => setResignForm((f) => ({ ...f, lastWorkingDay: v }))} />
            </div>
            <div>
              <Label>Notice period (days)</Label>
              <TextInput type="number" value={resignForm.noticePeriodDays} onChange={(e) => setResignForm((f) => ({ ...f, noticePeriodDays: e.target.value }))} className="mt-1" />
            </div>
            <div className="sm:col-span-3">
              <Label>Reason</Label>
              <Textarea rows={2} value={resignForm.reason} onChange={(e) => setResignForm((f) => ({ ...f, reason: e.target.value }))} className="mt-1" />
            </div>
            <div className="flex justify-end gap-2 sm:col-span-3">
              <Button color="gray" onClick={() => setResignOpen(false)} disabled={resignSaving}>
                Cancel
              </Button>
              <Button color="red" onClick={() => submitResignation(false)} isProcessing={resignSaving} disabled={resignSaving}>
                Submit resignation
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-xs text-gray-400">You are currently employed. Use "Apply for resignation" to submit a request to your admin.</p>
        )}
      </div>

      {editing ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-sm font-semibold text-gray-500">Edit your details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Full name</Label>
              <TextInput value={form.name} onChange={set("name")} className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <TextInput value={form.mobile} onChange={set("mobile")} icon={LuPhone} className="mt-1" />
            </div>
            <div>
              <Label>Alternate phone</Label>
              <TextInput value={form.alternateMobile} onChange={set("alternateMobile")} className="mt-1" />
            </div>
            <div>
              <Label>Personal email</Label>
              <TextInput type="email" value={form.personalEmail} onChange={set("personalEmail")} className="mt-1" />
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onChange={set("gender")} className="mt-1">
                <option value="">—</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label>Blood group</Label>
              <TextInput value={form.bloodGroup} onChange={set("bloodGroup")} placeholder="e.g. O+" className="mt-1" />
            </div>
            <div>
              <Label>Marital status</Label>
              <Select value={form.maritalStatus} onChange={set("maritalStatus")} className="mt-1">
                <option value="">—</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </Select>
            </div>
            <div>
              <Label>Bank account</Label>
              <TextInput value={form.bankAccount} onChange={set("bankAccount")} className="mt-1" />
            </div>
            <div>
              <Label>IFSC</Label>
              <TextInput value={form.ifsc} onChange={set("ifsc")} className="mt-1" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Label>Address</Label>
              <Textarea rows={2} value={form.address} onChange={set("address")} className="mt-1" />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button color="gray" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </Button>
            <Button color="blue" onClick={save} isProcessing={saving} disabled={saving || !form.name.trim()}>
              Save changes
            </Button>
          </div>
          <p className="mt-3 text-xs text-gray-400">Work details (designation, department, dates, etc.) are managed by your admin.</p>
        </div>
      ) : (
        <EmployeeProfileSections employee={{ ...user, ...form }} />
      )}
    </div>
  );
};

export default MyProfile;
