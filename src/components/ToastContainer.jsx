import PropTypes from "prop-types";
import { useToast } from "@/contexts/ToastContext";
import { useEffect } from "react";

const variantStyles = {
  info: "bg-blue-600",
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-500 text-black",
};

export const ToastContainer = ({ position = "top-right" }) => {
  const { toasts, remove } = useToast();

  const posClass = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  }[position];

  return (
    <div
      className={`pointer-events-none fixed z-[9999] ${posClass} flex flex-col gap-2 w-80 max-w-[92vw]`}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto group flex items-start gap-3 px-4 py-3 rounded-lg shadow text-white text-sm animate-fade-in border border-white/10 ${
            variantStyles[t.variant] || variantStyles.info
          }`}
          role="alert"
        >
          <span className="flex-1 break-words leading-snug">{t.msg}</span>
          <button
            onClick={() => remove(t.id)}
            className="opacity-70 hover:opacity-100 transition text-xs font-semibold"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

ToastContainer.propTypes = {
  position: PropTypes.oneOf(["top-right", "top-left", "bottom-right", "bottom-left"]),
};

export default ToastContainer;
