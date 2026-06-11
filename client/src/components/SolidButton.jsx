import { Button, Spinner } from "flowbite-react";
import React from "react";

const SolidButton = ({ loading, onClick, title, Icon, className = "", disabled }) => {
  return (
    <Button className={`bg-blue-400 cursor-pointer ${className}`} onClick={onClick} disabled={disabled || loading}>
      {loading ? (
        <Spinner aria-label="Small spinner example" size="sm" />
      ) : (
        <span className="flex items-center gap-2">
          {Icon ? <Icon size={"1.2rem"} /> : null}
          {title}
        </span>
      )}
    </Button>
  );
};

export default SolidButton;
