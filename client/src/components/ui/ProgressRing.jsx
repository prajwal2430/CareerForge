import React, { useEffect, useState } from 'react';

const ProgressRing = ({ 
  progress, 
  size = 120, 
  strokeWidth = 10, 
  color = 'var(--accent-primary)',
  trackColor = 'var(--surface-2)',
  label,
  valueText
}) => {
  const [offset, setOffset] = useState(0);
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    // Add slight delay for animation
    const timer = setTimeout(() => {
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [setOffset, circumference, progress, offset]);

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          stroke={trackColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset || circumference}
          r={radius}
          cx={center}
          cy={center}
          style={{ transition: 'stroke-dashoffset 1.5s ease-in-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="progress-ring-text">
        <span className="progress-ring-value">{valueText || `${progress}%`}</span>
        {label && <span className="progress-ring-label">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
