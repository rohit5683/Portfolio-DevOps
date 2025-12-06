import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'text', 
  width, 
  height 
}) => {
  const baseClasses = "animate-pulse bg-white/10";
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
