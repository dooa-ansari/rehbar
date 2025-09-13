import React from 'react';

export type StatusType = 'published' | 'paused';

interface StatusProps {
  status?: StatusType;
  onToggle?: (newStatus: StatusType) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Status: React.FC<StatusProps> = ({
  status = 'published',
  onToggle,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const isPublished = status === 'published';
  
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const handleClick = () => {
    if (!disabled && onToggle) {
      console.log('isPublished', isPublished);
      onToggle(isPublished ? 'paused' : 'published');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        rounded-full
        border-2
        transition-all
        duration-200
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        ${isPublished 
          ? 'bg-green-500 border-green-600 shadow-green-500/50' 
          : 'bg-red-500 border-red-600 shadow-red-500/50'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:scale-110 active:scale-95'
        }
        ${isPublished ? 'shadow-lg' : 'shadow-md'}
        ${className}
      `}
      aria-label={`Status: ${status}. Click to toggle.`}
      title={`Status: ${status}. Click to toggle.`}
    >
      <div 
        className={`
          w-full h-full rounded-full
          ${isPublished 
            ? 'bg-green-400 shadow-inner' 
            : 'bg-red-400 shadow-inner'
          }
          transition-all duration-200
        `}
      />
    </button>
  );
};

export default Status;
