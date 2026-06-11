import { enqueueSnackbar, closeSnackbar } from "notistack";
import { IoIosCloseCircleOutline } from "react-icons/io";

export const snackBarTypes = {
  default: "default",
  error: "error",
  success: "success",
  warning: "warning",
  info: "info",
};

export const dispatchSnackbar = (message, type = snackBarTypes.default) => {
  enqueueSnackbar(message, {
    variant: type,
    autoHideDuration: 3000,
    anchorOrigin: {
      vertical: "top",
      horizontal: "right",
    },
    action: (key) => (
      <IoIosCloseCircleOutline
        className="text-2xl text-white cursor-pointer"
        onClick={() => {
          closeSnackbar(key);
        }}
      />
    ),
  });
};
