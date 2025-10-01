/* eslint-disable react/prop-types */
// components/LoadingSpinner.js
import styles from "./LoadingSpinner.module.css"; // CSS module styling

/*
  Props:
  - message?: optional string under spinner
  - variant?: 'fullscreen' | 'block' | 'inline'
  - size?: number (px) to override default 50
  - className?: extra wrapper classes
*/
const LoadingSpinner = ({ message, variant = "block", size = 40, className = "" }) => {
  const isFullscreen = variant === "fullscreen";
  const isInline = variant === "inline";
  const wrapperClass = isFullscreen
    ? styles.overlay
    : isInline
    ? styles.inlineWrapper
    : styles.blockWrapper;

  return (
    <div className={`${wrapperClass} ${className}`.trim()} role="status" aria-live="polite">
      <div
        className={styles.spinner}
        style={{ width: size, height: size, borderWidth: Math.max(4, Math.round(size / 10)) }}
      />
      {message && <p className={styles.message}>{message}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
