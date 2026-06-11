import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

export const handleValidationError = (isInvalid, body) => {
  const errors = Object.values(isInvalid);
  const success = errors.length ? false : true;
  if (!success) {
    dispatchSnackbar(errors[0], snackBarTypes.error);
  }
  const result = success ? body : isInvalid;
  return { result, success };
};
