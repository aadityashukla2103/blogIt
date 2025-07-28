import React from "react";

const Input = ({ label, type = "text", placeholder, onChange, ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>
    )}
    <input
      className="focus:outline-none focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow"
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      {...props}
    />
  </div>
);

export default Input;
