import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateEmail, validateFileUrl, validateIFSC, validateObjectId, validatePan, validatePhoneNumber, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useAddEmployee = (name, email, dob, shift, empCode, mobile, designation, department, manager, password, documents, joiningDate, pan, photo, bankAccount, ifsc, attendancePunchType, onCreate) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.employee.create]);
  const [error, setError] = useState({});

  const handleAddEmployee = async () => {
    const { success, result } = validator(name, email, dob, shift, empCode, mobile, designation, department, manager, password, documents, joiningDate, pan, photo, bankAccount, ifsc, attendancePunchType);
    if (success) {
      const res = await API.employee.create(result);
      if (res.success) {
        dispatchSnackbar("Employee Created Successfully", snackBarTypes.success);
        onCreate();
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [name, email, dob, shift, empCode, mobile, designation, department, manager, password, documents, joiningDate, pan, photo, bankAccount, ifsc]);

  return { handleAddEmployee, error, loading };
};

const validator = (name, email, dob, shift, empCode, mobile, designation, department, manager, password, documents, joiningDate, pan, photo, bankAccount, ifsc, attendancePunchType) => {
  const isInvalid = {};
  const body = {};
  if (attendancePunchType === "qr" || attendancePunchType === "selfie") {
    body.attendancePunchType = attendancePunchType;
  }

  if (validateStringLength(name, 3, 100)) {
    body.name = name;
  } else {
    isInvalid.name = "Name must be minimum 3 and maximum 100 characters.";
  }
  if (validateEmail(email)) {
    body.email = email;
  } else {
    isInvalid.email = "Invalid email address";
  }
  if (validateTimestamp(dob)) {
    body.dob = dob;
  } else {
    isInvalid.dob = "Invalid Date of birth";
  }
  if (validateObjectId(shift)) {
    body.shift = shift;
  } else {
    isInvalid.shift = "Shift is required";
  }
  if (empCode) {
    if (validateStringLength(empCode, 2, 16)) {
      body.empCode = empCode;
    } else {
      isInvalid.empCode = "Emp Code must be minimum 2 and maximum 16 characters.";
    }
  }
  if (validatePhoneNumber(mobile)) {
    body.mobile = mobile;
  } else {
    isInvalid.mobile = "Invalid mobile number";
  }

  if (designation) {
    if (validateStringLength(designation, 2, 128)) {
      body.designation = designation;
    } else {
      isInvalid.designation = "Designation must be minimum 2 and maximum 128 characters.";
    }
  }

  if (department) {
    if (validateObjectId(department)) {
      body.department = department;
    } else {
      isInvalid.department = "Invalid department ID";
    }
  }
  if (manager) {
    if (validateObjectId(manager)) {
      body.manager = manager;
    } else {
      isInvalid.manager = "Invalid manager ID";
    }
  }

  if (validateStringLength(password, 6, 200)) {
    body.password = password;
  } else {
    isInvalid.password = "Password must be minimum 6 characters.";
  }

  if (documents && Array.isArray(documents)) {
    const invalidDocuments = documents.filter((doc) => {
      return !(doc.name && validateStringLength(doc.name, 1, 64) && doc.url && validateFileUrl(doc.url) && doc.type && validateStringLength(doc.type, 1, 64));
    });
    if (invalidDocuments.length > 0) {
      isInvalid.documents = "Invalid Ducuments";
    } else {
      body.documents = documents.map((doc) => {
        return {
          name: doc.name,
          url: doc.url,
          type: doc.type,
        };
      });
    }
  }
  if (validateTimestamp(joiningDate)) {
    body.joiningDate = joiningDate;
  } else {
    isInvalid.joiningDate = "Invalid Joining Date";
  }

  if (validatePan(pan)) {
    body.pan = pan;
  } else {
    isInvalid.pan = "PAN is invalid";
  }

  if (photo) {
    if (validateFileUrl(photo)) {
      body.photo = photo;
    } else {
      isInvalid.photo = "Not a valid file URL";
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

  return handleValidationError(isInvalid, body);
};

export default useAddEmployee;
