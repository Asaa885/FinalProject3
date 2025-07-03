import React from "react";

export const Button = ({ children, onClick, type = "button", variant = "default" }) => {
  const base = "px-4 py-2 rounded text-white";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700",
    destructive: "bg-red-600 hover:bg-red-700",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.default}`}
    >
      {children}
    </button>
  );
};
