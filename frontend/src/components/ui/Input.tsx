import { forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
        <input
          ref={ref}
          {...props}
          className={clsx(
            "w-full p-2 border rounded-md focus:ring-2 focus:ring-black outline-none",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
