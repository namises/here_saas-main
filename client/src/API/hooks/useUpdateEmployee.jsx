import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateEmail, validateFileUrl, validateFinancialYear, validateObjectId, validatePan, validatePhoneNumber, validateRangeNumber, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useUpdateEmployee = (employeeId, onUpdate) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.employee.update]);
  const [error, setError] = useState({});
  const handleUpdateEmployee = async (updatePayload) => {
    const { name, email, shift, empCode, mobile, designation, department, manager, documents, joiningDate, pan, photo, bankAccount, ifsc, permissions } = updatePayload;
    const { success, result } = validator(employeeId, name, email, shift, empCode, mobile, designation, department, manager, documents, joiningDate, pan, photo, bankAccount, ifsc, permissions);
    if (success) {
      const res = await API.employee.update(result);
      if (res.success) {
        onUpdate();
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [employeeId]);

  return { handleUpdateEmployee, error, loading };
};

const validator = (employeeId, name, email, shift, empCode, mobile, designation, department, manager, documents, joiningDate, pan, photo, bankAccount, ifsc, permissions) => {
  console.log({ employeeId, name, email, shift, empCode, mobile, designation, department, manager, documents, joiningDate, pan, photo, bankAccount, ifsc, permissions });
  const isInvalid = {};
  const body = {};
  if (validateObjectId(employeeId)) {
    body.employeeId = employeeId;
  } else {
    isInvalid.employeeId = "Invalid Employee Id";
  }
  if (name) {
    if (validateStringLength(name, 1, 128)) {
      body.name = name;
    } else {
      isInvalid.name = "Invalid Name";
    }
  }
  if (email) {
    if (validateEmail(email)) {
      body.email = email;
    } else {
      isInvalid.email = "Invalid Email";
    }
  }

  if (shift) {
    if (validateObjectId(shift)) {
      body.shift = shift;
    } else {
      isInvalid.shift = "Invalid Shift";
    }
  }
  if (empCode) {
    if (empCode && empCode.length) {
      body.empCode = empCode;
    } else {
      isInvalid.empCode = "Invalid Employee Code";
    }
  }
  if (mobile) {
    if (validatePhoneNumber(mobile)) {
      body.mobile = mobile;
    } else {
      isInvalid.mobile = "Invalid Mobile Number";
    }
  }
  if (designation) {
    if (validateStringLength(designation, 1, 128)) {
      body.designation = designation;
    } else {
      isInvalid.designation = "Invalid Designation";
    }
  }
  if (department) {
    if (validateObjectId(department)) {
      body.department = department;
    } else {
      isInvalid.department = "Invalid Department";
    }
  }
  if (manager) {
    if (validateObjectId(manager)) {
      body.manager = manager;
    } else {
      isInvalid.manager = "Invalid Manager";
    }
  }
  if (documents) {
    if (Array.isArray(documents) && documents.every((doc) => doc.name && doc.url && doc.type)) {
      body.documents = documents;
    } else {
      isInvalid.documents = "Invalid Documents";
    }
  }
  if (joiningDate) {
    if (validateTimestamp(joiningDate)) {
      body.joiningDate = joiningDate;
    } else {
      isInvalid.joiningDate = "Invalid Joining Date";
    }
  }
  if (pan) {
    if (validatePan(pan)) {
      body.pan = pan.toUpperCase().trim();
    } else {
      isInvalid.pan = "Invalid PAN";
    }
  }
  if (photo) {
    if (validateFileUrl(photo)) {
      body.photo = photo;
    } else {
      isInvalid.photo = "Invalid Photo URL";
    }
  }
  if (bankAccount) {
    if (validateStringLength(bankAccount, 1, 30)) {
      body.bankAccount = bankAccount;
    } else {
      isInvalid.bankAccount = "Not a valid Bank Account No,";
    }
  }
  if (ifsc) {
    if (validateIFSC(ifsc)) {
      body.ifsc = ifsc;
    } else {
      isInvalid.ifsc = "Not a valid IFSC code";
    }
  }
  if (permissions) {
    if (Array.isArray(permissions) && permissions.every((perm) => typeof perm === "string")) {
      body.permissions = permissions;
    } else {
      isInvalid.permissions = "Invalid Permissions";
    }
  }
  return handleValidationError(isInvalid, body);
};

export default useUpdateEmployee;
