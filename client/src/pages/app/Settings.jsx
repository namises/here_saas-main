import React, { useEffect, useState } from "react";
import { Badge, Card, Label, Radio, Spinner } from "flowbite-react";
import { HiOutlineQrCode } from "react-icons/hi2";
import { HiCamera } from "react-icons/hi";
import { MdSwitchLeft } from "react-icons/md";
import { API } from "src/API/api";
import SolidButton from "src/components/SolidButton";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const PUNCH_TYPES = [
  {
    value: "qr",
    label: "QR Code Only",
    description: "Employees scan a TOTP QR code to punch in/out.",
    Icon: HiOutlineQrCode,
  },
  {
    value: "selfie",
    label: "Selfie Only",
    description: "Employees take a selfie with location to punch in/out.",
    Icon: HiCamera,
  },
  {
    value: "both",
    label: "Both (Employee's Choice)",
    description: "Employees can choose either QR or selfie to punch in/out.",
    Icon: MdSwitchLeft,
  },
];

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [selectedPunchType, setSelectedPunchType] = useState("qr");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.organization.getSettings().then((res) => {
      if (res.success) {
        setSettings(res.data.settings);
        setSelectedPunchType(res.data.settings.attendancePunchType ?? "qr");
      }
    }).finally(() => setLoadingSettings(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await API.organization.updateSettings({ attendancePunchType: selectedPunchType });
    setSaving(false);
    if (res.success) {
      setSettings((prev) => ({ ...prev, attendancePunchType: selectedPunchType }));
      dispatchSnackbar("Settings saved successfully", snackBarTypes.success);
    } else {
      dispatchSnackbar(res.message || "Failed to save settings", snackBarTypes.failure);
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h2 className="text-white text-2xl font-bold">Organization Settings</h2>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Punch-In Method</h3>
          <Badge color={settings?.attendancePunchType === "selfie" ? "purple" : settings?.attendancePunchType === "both" ? "warning" : "blue"} className="capitalize">
            Current: {settings?.attendancePunchType ?? "qr"}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Choose how employees mark their attendance. Changes apply immediately for all users.
        </p>

        <div className="flex flex-col gap-4">
          {PUNCH_TYPES.map(({ value, label, description, Icon }) => (
            <label
              key={value}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedPunchType === value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
              }`}
            >
              <Radio
                name="punchType"
                value={value}
                checked={selectedPunchType === value}
                onChange={() => setSelectedPunchType(value)}
                className="mt-1"
              />
              <div className="flex items-start gap-3">
                <Icon className="text-2xl text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <SolidButton
            title="Save Settings"
            loading={saving}
            onClick={handleSave}
            disabled={selectedPunchType === settings?.attendancePunchType}
          />
        </div>
      </Card>
    </div>
  );
};

export default Settings;
