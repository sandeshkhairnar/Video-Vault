import React from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  XCircle 
} from 'lucide-react';

const ALERT_VARIANTS = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: <XCircle className="h-5 w-5 text-red-600" />,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: <Info className="h-5 w-5 text-blue-600" />,
  },
};

// AlertTitle Component
export const AlertTitle = ({ children, className = '' }) => (
  <h3 className={`text-sm font-semibold mb-1 ${className}`}>
    {children}
  </h3>
);

// AlertDescription Component
export const AlertDescription = ({ children, className = '' }) => (
  <p className={`text-sm ${className}`}>
    {children}
  </p>
);

export const Alert = ({ 
  variant = 'info', 
  children, 
  onClose, 
  dismissible = false 
}) => {
  const variantStyles = ALERT_VARIANTS[variant] || ALERT_VARIANTS.info;

  return (
    <div 
      className={`
        ${variantStyles.bg} 
        ${variantStyles.border} 
        ${variantStyles.text}
        border rounded-lg p-4 flex items-start space-x-3 
        shadow-sm relative
      `}
      role="alert"
    >
      <div className="flex-shrink-0">
        {variantStyles.icon}
      </div>

      <div className="flex-1">
        {children}
      </div>

      {dismissible && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Dismiss alert"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const SuccessAlert = (props) => <Alert variant="success" {...props} />;
export const ErrorAlert = (props) => <Alert variant="error" {...props} />;
export const WarningAlert = (props) => <Alert variant="warning" {...props} />;
export const InfoAlert = (props) => <Alert variant="info" {...props} />;

export default Alert;