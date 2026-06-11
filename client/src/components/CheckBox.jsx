import { Checkbox, Label } from "flowbite-react";
import React from "react";

const CheckBox = ({ href, hrefText, label, value, setter, error, hideError }) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={value} onChange={(e) => setter(e.target.checked)} />
      <div className="flex gap-4">
        <Label className="text-sm text-gray-400">
          {label}{" "}
          {href && hrefText ? (
            <a href={href} className="text-blue-500 hover:underline">
              {hrefText}
            </a>
          ) : null}
        </Label>
        {hideError ? null : <span className="ml-1 text-xs text-red-400">{error}&nbsp;</span>}
      </div>
    </div>
  );
};

export default CheckBox;
