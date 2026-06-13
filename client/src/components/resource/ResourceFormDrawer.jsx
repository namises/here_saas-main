import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import React, { useEffect, useState } from "react";
import SolidButton from "../SolidButton";
import { toDateInput, fromDateInput, titleCase } from "src/utils/ui";

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-900";

const Field = ({ field, value, onChange }) => {
  const { name, label, type = "text", options = [], placeholder, required, min, max, hint } = field;
  const set = (v) => onChange(name, v);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </label>
      {type === "textarea" ? (
        <textarea className={inputCls} rows={3} value={value ?? ""} placeholder={placeholder} onChange={(e) => set(e.target.value)} />
      ) : type === "select" ? (
        <select className={inputCls} value={value ?? ""} onChange={(e) => set(e.target.value)}>
          <option value="">{placeholder || "Select…"}</option>
          {options.map((o) => {
            const v = typeof o === "string" ? o : o.value;
            const l = typeof o === "string" ? titleCase(o) : o.label;
            return (
              <option key={v} value={v}>
                {l}
              </option>
            );
          })}
        </select>
      ) : type === "date" ? (
        <input type="date" className={inputCls} value={toDateInput(value)} onChange={(e) => set(fromDateInput(e.target.value))} />
      ) : type === "checkbox" ? (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input type="checkbox" className="h-4 w-4 rounded border-gray-300" checked={!!value} onChange={(e) => set(e.target.checked)} />
          {hint || "Enable"}
        </label>
      ) : type === "number" || type === "money" ? (
        <input type="number" className={inputCls} value={value ?? ""} placeholder={placeholder} min={min} max={max} onChange={(e) => set(e.target.value === "" ? "" : Number(e.target.value))} />
      ) : (
        <input type="text" className={inputCls} value={value ?? ""} placeholder={placeholder} onChange={(e) => set(e.target.value)} />
      )}
      {hint && type !== "checkbox" ? <p className="mt-1 text-xs text-gray-400">{hint}</p> : null}
    </div>
  );
};

/**
 * Generic create/edit drawer driven by a field config.
 * @param {object[]} fields  [{ name, label, type, options, required, ... }]
 * @param {object} editing   record being edited (or null for create)
 * @param {(values) => Promise<boolean>} onSubmit
 */
const ResourceFormDrawer = ({ open, onClose, title, fields, editing, onSubmit, submitting }) => {
  const [values, setValues] = useState({});

  useEffect(() => {
    if (open) {
      const init = {};
      fields.forEach((f) => {
        const cur = editing?.[f.name];
        init[f.name] = cur && typeof cur === "object" && cur._id ? cur._id : cur ?? f.default ?? (f.type === "checkbox" ? false : "");
      });
      setValues(init);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const onChange = (name, v) => setValues((p) => ({ ...p, [name]: v }));

  const submit = async () => {
    const payload = {};
    fields.forEach((f) => {
      const v = values[f.name];
      if (v === "" || v === null || v === undefined) return;
      payload[f.name] = v;
    });
    if (editing?._id) payload.id = editing._id;
    const ok = await onSubmit(payload);
    if (ok) onClose();
  };

  return (
    <Drawer className="w-full max-w-[560px] z-100" open={open} onClose={onClose} position="right">
      <DrawerHeader title={title || (editing ? "Edit" : "Add New")} titleIcon={() => null} />
      <DrawerItems>
        <div className="flex flex-col gap-4 pb-24">
          {fields.map((f) => (
            <Field key={f.name} field={f} value={values[f.name]} onChange={onChange} />
          ))}
          <div className="fixed bottom-0 right-0 w-full max-w-[560px] border-t border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <SolidButton title={editing ? "Save changes" : "Create"} loading={submitting} onClick={submit} className="w-full" />
          </div>
        </div>
      </DrawerItems>
    </Drawer>
  );
};

export default ResourceFormDrawer;
