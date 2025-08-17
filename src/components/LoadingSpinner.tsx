"use client";
import React from "react";

type Props = {
  size?: number;         // px
  className?: string;
  label?: string;
};

function Spinner({ size = 24, className = "", label }: Props) {
  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="animate-spin"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth="4"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {label ? <span className="text-sm text-white/80">{label}</span> : null}
    </div>
  );
}

export default Spinner;                 // default export
export { Spinner as LoadingSpinner };   // named export (compat)
