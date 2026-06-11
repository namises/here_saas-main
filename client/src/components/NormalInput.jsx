import { TextInput } from "flowbite-react";
import React from "react";

const NormalInput = ({ label, value, setter, error, required, type = "text", disabled, placholder }) => {
  const onChange = (e) => setter(e.target.value);
  return (
    <div className="mb-2 w-full">
      <div className="flex justify-between items-center">
        <span className="text-sm m-0 text-gray-400">{required ? `${label}*` : label}</span>
        <span className="ml-1 text-xs mb-0 text-red-400">{error}&nbsp;</span>
      </div>
      <TextInput placholder={placholder} disabled={disabled} value={value} onChange={onChange} type={type} />
    </div>
  );
};

export default NormalInput;

//  <FloatingLabel className="px-2" variant="filled" label={required ? `${label}*` : label} disabled={disabled} value={value} onChange={onChange} type={type} />
