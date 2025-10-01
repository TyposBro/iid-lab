import { createContext, useContext, useCallback, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const ToastContext = createContext(null);
let idSeq = 0;

export const ToastProvider = ({ children, max = 5, duration = 4000 }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const tm = timers.current.get(id);
    if (tm) {
      clearTimeout(tm);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (msg, variant = "info", opts = {}) => {
      const id = ++idSeq;
      setToasts((t) => {
        const next = [...t, { id, msg, variant }];
        if (next.length > max) next.shift();
        return next;
      });
      const ttl = opts.duration ?? duration;
      if (ttl > 0) {
        const tm = setTimeout(() => remove(id), ttl);
        timers.current.set(id, tm);
      }
      return id;
    },
    [duration, max, remove]
  );

  const api = {
    push,
    remove,
    info: (m, o) => push(m, "info", o),
    success: (m, o) => push(m, "success", o),
    error: (m, o) => push(m, "error", o),
    warning: (m, o) => push(m, "warning", o),
    toasts,
  };

  useEffect(() => () => timers.current.forEach((tm) => clearTimeout(tm)), []);

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  max: PropTypes.number,
  duration: PropTypes.number,
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
