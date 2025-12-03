import React, {forwardRef} from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({label, error, helpText, className = "", ...props}, ref) => {
        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    className={`
            w-full px-3 py-2 border rounded-lg shadow-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}
          `}
                    {...props}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}
                {!error && helpText && (
                    <p className="text-sm text-gray-500">{helpText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
