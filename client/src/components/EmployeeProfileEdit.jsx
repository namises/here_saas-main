import React, { useState } from "react";
import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import DepartmentSearchDropdown from "./DepartmentSearchDropdown";
import EmployeeSearchDropdown from "./EmployeeSearchDropdown";
import DateInput from "./DateInput";
import { API } from "src/API/api";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const idOf = (v) => (v && typeof v === "object" ? v._id : v);

// Admin-facing editable employee profile. Saves via /employee/update (full admin control).
const EmployeeProfileEdit = ({ employee, onSaved, onCancel }) => {
  const e = employee || {};
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    // personal
    name: e.name || "",
    dob: e.dob || "",
    gender: e.gender || "",
    bloodGroup: e.bloodGroup || "",
    maritalStatus: e.maritalStatus || "",
    status: e.status || "active",
    // contact
    email: e.email || "",
    personalEmail: e.personalEmail || "",
    mobile: e.mobile || "",
    alternateMobile: e.alternateMobile || "",
    address: e.address || "",
    // work
    empCode: e.empCode || "",
    joiningDate: e.joiningDate || "",
    probationPeriodMonths: e.probationPeriodMonths ?? "",
    probationStatus: e.probationStatus || "",
    employeeType: e.employeeType || "",
    workLocation: e.workLocation || "",
    workExperienceYears: e.workExperienceYears ?? "",
    billingStatus: e.billingStatus || "",
    // work info
    designation: e.designation || "",
    jobTitle: e.jobTitle || "",
    department: idOf(e.department) || "",
    subDepartment: e.subDepartment || "",
    manager: idOf(e.manager) || "",
    // comp + attendance
    pan: e.pan || "",
    bankAccount: e.bankAccount || "",
    ifsc: e.ifsc || "",
    attendancePunchType: e.attendancePunchType || "",
    // resignation
    resignationStatus: e.resignation?.status || "none",
    resignedOn: e.resignation?.resignedOn || "",
    lastWorkingDay: e.resignation?.lastWorkingDay || "",
    resignationReason: e.resignation?.reason || "",
    noticePeriodDays: e.resignation?.noticePeriodDays ?? "",
  });

  const set = (k) => (val) => setForm((f) => ({ ...f, [k]: val?.target ? val.target.value : val }));

  const save = async () => {
    setSaving(true);
    try {
      // Enum selects: omit when blank (Joi enums reject ""). Numbers: convert or null. Text: send as-is.
      const enums = ["gender", "maritalStatus", "probationStatus", "employeeType", "billingStatus"];
      const resignationKeys = new Set(["resignationStatus", "resignedOn", "lastWorkingDay", "resignationReason", "noticePeriodDays"]);
      const payload = { employeeId: e._id };
      Object.entries(form).forEach(([k, v]) => {
        if (resignationKeys.has(k)) return; // handled below
        if (enums.includes(k)) {
          if (v) payload[k] = v;
        } else if (k === "attendancePunchType") {
          payload[k] = v || null;
        } else if (k === "probationPeriodMonths" || k === "workExperienceYears") {
          payload[k] = v === "" || v == null ? null : Number(v);
        } else if (k === "department" || k === "manager") {
          if (v) payload[k] = v;
        } else if (v !== "" && v != null) {
          // Omit empty strings — sending e.g. pan:"" fails the server's format validators.
          payload[k] = v;
        }
      });
      payload.resignation = {
        status: form.resignationStatus || "none",
        resignedOn: form.resignedOn ? Number(form.resignedOn) : null,
        lastWorkingDay: form.lastWorkingDay ? Number(form.lastWorkingDay) : null,
        reason: form.resignationReason || null,
        noticePeriodDays: form.noticePeriodDays === "" || form.noticePeriodDays == null ? null : Number(form.noticePeriodDays),
      };
      // Keep employee status in sync when admin marks resignation approved/completed.
      if (["approved", "completed"].includes(payload.resignation.status)) payload.status = "resigned";
      const res = await API.employee.update(payload);
      if (res?.success) {
        dispatchSnackbar("Employee updated", snackBarTypes.success);
        onSaved?.();
      } else {
        dispatchSnackbar(res?.message || "Could not update employee", snackBarTypes.failure);
      }
    } catch (err) {
      dispatchSnackbar(err?.message || "Something went wrong", snackBarTypes.failure);
    } finally {
      setSaving(false);
    }
  };

  const F = ({ label, k, type = "text", placeholder }) => (
    <div>
      <Label>{label}</Label>
      <TextInput type={type} value={form[k]} onChange={set(k)} placeholder={placeholder} className="mt-1" />
    </div>
  );
  const Sel = ({ label, k, options }) => (
    <div>
      <Label>{label}</Label>
      <Select value={form[k]} onChange={set(k)} className="mt-1">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );

  const Group = ({ title, children }) => (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Group title="Personal">
        <F label="Full name" k="name" />
        <div>
          <Label>Date of birth</Label>
          <DateInput value={form.dob} setter={set("dob")} />
        </div>
        <Sel label="Gender" k="gender" options={[{ value: "", label: "—" }, { value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} />
        <F label="Blood group" k="bloodGroup" placeholder="e.g. O+" />
        <Sel label="Marital status" k="maritalStatus" options={[{ value: "", label: "—" }, { value: "single", label: "Single" }, { value: "married", label: "Married" }, { value: "divorced", label: "Divorced" }, { value: "widowed", label: "Widowed" }]} />
        <Sel label="Employee status" k="status" options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "resigned", label: "Resigned" }, { value: "terminated", label: "Terminated" }]} />
      </Group>

      <Group title="Contact">
        <F label="Official email" k="email" type="email" />
        <F label="Personal email" k="personalEmail" type="email" />
        <F label="Phone" k="mobile" />
        <F label="Alternate phone" k="alternateMobile" />
        <div className="sm:col-span-2 lg:col-span-1">
          <Label>Address</Label>
          <Textarea rows={2} value={form.address} onChange={set("address")} className="mt-1" />
        </div>
      </Group>

      <Group title="Work">
        <F label="Employee ID / code" k="empCode" />
        <div>
          <Label>Date of joining</Label>
          <DateInput value={form.joiningDate} setter={set("joiningDate")} />
        </div>
        <F label="Probation period (months)" k="probationPeriodMonths" type="number" />
        <Sel label="Probation status" k="probationStatus" options={[{ value: "", label: "—" }, { value: "on-probation", label: "On probation" }, { value: "confirmed", label: "Confirmed" }, { value: "extended", label: "Extended" }]} />
        <Sel label="Employee type" k="employeeType" options={[{ value: "", label: "—" }, { value: "full-time", label: "Full-time" }, { value: "part-time", label: "Part-time" }, { value: "contract", label: "Contract" }, { value: "intern", label: "Intern" }]} />
        <F label="Work location" k="workLocation" />
        <F label="Work experience (years)" k="workExperienceYears" type="number" />
        <Sel label="Billing status" k="billingStatus" options={[{ value: "", label: "—" }, { value: "billable", label: "Billable" }, { value: "non-billable", label: "Non-billable" }]} />
      </Group>

      <Group title="Work info">
        <F label="Designation" k="designation" />
        <F label="Job title" k="jobTitle" />
        <DepartmentSearchDropdown label="Department" value={form.department} setter={set("department")} />
        <F label="Sub department" k="subDepartment" />
        <EmployeeSearchDropdown label="Manager" value={form.manager} setter={set("manager")} />
      </Group>

      <Group title="Payroll & attendance">
        <F label="PAN" k="pan" />
        <F label="Bank account" k="bankAccount" />
        <F label="IFSC" k="ifsc" />
        <Sel
          label="Attendance punch method"
          k="attendancePunchType"
          options={[
            { value: "", label: "Org default" },
            { value: "qr", label: "QR / Device" },
            { value: "selfie", label: "Selfie + Location" },
          ]}
        />
      </Group>

      <Group title="Resignation">
        <Sel
          label="Resignation status"
          k="resignationStatus"
          options={[
            { value: "none", label: "None (employed)" },
            { value: "submitted", label: "Submitted" },
            { value: "approved", label: "Approved" },
            { value: "withdrawn", label: "Withdrawn" },
            { value: "completed", label: "Completed (exited)" },
          ]}
        />
        <div>
          <Label>Resigned on</Label>
          <DateInput value={form.resignedOn} setter={set("resignedOn")} />
        </div>
        <div>
          <Label>Last working day</Label>
          <DateInput value={form.lastWorkingDay} setter={set("lastWorkingDay")} />
        </div>
        <F label="Notice period (days)" k="noticePeriodDays" type="number" />
        <div className="sm:col-span-2 lg:col-span-3">
          <Label>Reason</Label>
          <Textarea rows={2} value={form.resignationReason} onChange={set("resignationReason")} className="mt-1" />
        </div>
      </Group>

      <p className="text-xs text-gray-400">Marking resignation Approved or Completed sets the employee's status to "resigned".</p>

      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button color="gray" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        ) : null}
        <Button color="blue" onClick={save} isProcessing={saving} disabled={saving}>
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default EmployeeProfileEdit;
