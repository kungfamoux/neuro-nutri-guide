import React, { HTMLAttributes } from 'react';
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  /** Value between 0 and 1 representing the progress */
  value: number;
  /** Optional label for accessibility */
  label?: string;
  /** Additional CSS classes */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label, className = '', ...rest }) => {
  const percentage = Math.min(100, Math.max(0, value * 100));
  const roundedPercentage = Math.round(percentage);
  const ariaLabel = label || `Progress: ${roundedPercentage}%`;
  
  const riskLevel = value > 0.7 ? 'highRisk' : value > 0.4 ? 'mediumRisk' : 'lowRisk';
  
  // Generate dynamic width class
  const widthClass = `width-${Math.floor(percentage / 5) * 5}`; // Round to nearest 5%
  
  // Prepare ARIA attributes with correct types
  const ariaProps = {
    'aria-valuenow': roundedPercentage,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-label': ariaLabel,
  };
  
  return (
    <div className={`${styles.progressBarContainer} ${className}`} {...rest}>
      <div 
        role="progressbar"
        {...ariaProps}
        className={`${styles.progressBar} ${styles[riskLevel]} ${styles[widthClass]}`}
      />
    </div>
  );
};

export default ProgressBar;
