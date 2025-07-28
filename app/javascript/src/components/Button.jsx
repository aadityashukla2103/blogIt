import React from "react";

const Button = ({ buttonText, loading, ...props }) => (
  <button
    {...props}
    className="focus:outline-none focus:shadow-outline rounded bg-blue-600 py-2 px-4 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    disabled={loading || props.disabled}
  >
    {loading ? "Loading..." : buttonText}
  </button>
);

export default Button;
