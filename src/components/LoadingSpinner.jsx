/* eslint-disable react/prop-types */
// components/LoadingSpinner.js
import styles from "./LoadingSpinner.module.css"; // Create a CSS module for styling

const LoadingSpinner = ({ message }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
