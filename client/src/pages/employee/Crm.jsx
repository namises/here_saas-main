import React from "react";
import { LuContact, LuConstruction } from "react-icons/lu";

// Placeholder — CRM scope is not yet defined (leads/contacts? deals pipeline?).
// See HANDOFF.md "Decisions / open questions for the user".
const Crm = () => (
  <div className="mx-auto max-w-2xl">
    <div className="mb-5">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CRM</h1>
      <p className="text-sm text-gray-400">Customer relationship management.</p>
    </div>
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-12 text-center shadow-sm dark:bg-gray-800">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-500 dark:bg-teal-900/30">
        <LuContact size="2rem" />
      </span>
      <p className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
        <LuConstruction className="text-amber-500" /> Coming soon
      </p>
      <p className="max-w-md text-sm text-gray-400">
        The CRM module is being scoped. Let us know what you need — leads &amp; contacts, a deals pipeline, follow-up tasks, or
        customer notes — and it will be built to match.
      </p>
    </div>
  </div>
);

export default Crm;
