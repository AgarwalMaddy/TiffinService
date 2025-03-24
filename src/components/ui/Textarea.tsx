import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={`
              block w-full px-4 py-2.5
              bg-white border-2 rounded-lg
              text-gray-900 text-sm
              placeholder:text-gray-700
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-orange-500/20
              ${error 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-orange-500'
              }
              ${className}
            `}
            {...props}
          />
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea; 
