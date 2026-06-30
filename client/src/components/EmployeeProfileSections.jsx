import React from "react";
import { LuUser, LuPhone, LuBriefcase, LuBuilding2, LuHistory, LuLogOut } from "react-icons/lu";
import { fmtDate, titleCase } from "src/utils/ui";

const Field = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
    <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{value || value === 0 ? value : "—"}</p>
  </div>
);

const Section = ({ title, Icon, children }) => (
  <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-900/30">
        <Icon size="1.05rem" />
      </span>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
    </div>
    {children}
  </div>
);

const Grid = ({ children }) => <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">{children}</div>;

const cap = (v) => (v ? titleCase(v) : "—");
const deptName = (d) => (d && typeof d === "object" ? d.name : d);

// Read-only, sectioned display of an employee (works for both self and admin views).
const EmployeeProfileSections = ({ employee = {} }) => {
  const e = employee || {};
  const history = Array.isArray(e.workHistory) ? e.workHistory : [];
  const resignedish = e.status === "resigned" || (e.resignation && e.resignation.status && e.resignation.status !== "none");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Section title="Personal" Icon={LuUser}>
        <Grid>
          <Field label="Full name" value={e.name} />
          <Field label="Date of birth" value={e.dob ? fmtDate(e.dob) : "—"} />
          <Field label="Gender" value={cap(e.gender)} />
          <Field label="Blood group" value={e.bloodGroup} />
          <Field label="Marital status" value={cap(e.maritalStatus)} />
          <Field label="Employee status" value={cap(e.status)} />
        </Grid>
      </Section>

      <Section title="Contact" Icon={LuPhone}>
        <Grid>
          <Field label="Official email" value={e.email} />
          <Field label="Personal email" value={e.personalEmail} />
          <Field label="Phone" value={e.mobile} />
          <Field label="Alternate phone" value={e.alternateMobile} />
          <Field label="Address" value={e.address} />
        </Grid>
      </Section>

      <Section title="Work" Icon={LuBriefcase}>
        <Grid>
          <Field label="Employee ID" value={e.empCode} />
          <Field label="Date of joining" value={e.dateOfJoining || e.joiningDate ? fmtDate(e.dateOfJoining || e.joiningDate) : "—"} />
          <Field label="Probation period" value={e.probationPeriodMonths != null ? `${e.probationPeriodMonths} mo` : "—"} />
          <Field label="Probation status" value={cap(e.probationStatus)} />
          <Field label="Employee type" value={cap(e.employeeType)} />
          <Field label="Work location" value={e.workLocation} />
          <Field label="Work experience" value={e.workExperienceYears != null ? `${e.workExperienceYears} yr` : "—"} />
          <Field label="Billing status" value={cap(e.billingStatus)} />
        </Grid>
      </Section>

      <Section title="Work info" Icon={LuBuilding2}>
        <Grid>
          <Field label="Designation" value={e.designation} />
          <Field label="Job title" value={e.jobTitle} />
          <Field label="Department" value={deptName(e.department)} />
          <Field label="Sub department" value={e.subDepartment} />
        </Grid>
      </Section>

      <Section title="Work history" Icon={LuHistory}>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400">No previous employment recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-gray-400">
                  <th className="pb-2 pr-3">Department</th>
                  <th className="pb-2 pr-3">Designation</th>
                  <th className="pb-2 pr-3">From</th>
                  <th className="pb-2">To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.map((h, i) => (
                  <tr key={h._id || i} className="text-gray-700 dark:text-gray-200">
                    <td className="py-2 pr-3">{h.department || "—"}</td>
                    <td className="py-2 pr-3">{h.designation || "—"}</td>
                    <td className="py-2 pr-3">{h.from ? fmtDate(h.from) : "—"}</td>
                    <td className="py-2">{h.to ? fmtDate(h.to) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Resignation info" Icon={LuLogOut}>
        {!resignedish ? (
          <p className="text-sm text-gray-400">Currently employed — no resignation on record.</p>
        ) : (
          <Grid>
            <Field label="Status" value={cap(e.resignation?.status)} />
            <Field label="Resigned on" value={e.resignation?.resignedOn ? fmtDate(e.resignation.resignedOn) : "—"} />
            <Field label="Last working day" value={e.resignation?.lastWorkingDay ? fmtDate(e.resignation.lastWorkingDay) : "—"} />
            <Field label="Notice period" value={e.resignation?.noticePeriodDays != null ? `${e.resignation.noticePeriodDays} days` : "—"} />
            <Field label="Reason" value={e.resignation?.reason} />
          </Grid>
        )}
      </Section>
    </div>
  );
};

export default EmployeeProfileSections;
