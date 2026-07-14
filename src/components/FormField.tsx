/**
 * FormField — stable module-level component.
 * NEVER define this inside another component — that causes React to
 * unmount/remount it on every keystroke, losing focus.
 */
import { useState } from "react";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  icon?: React.ElementType;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function FormField({
  label, name, type = "text", placeholder, value, onChange, onBlur,
  error, touched, icon: Icon, autoFocus, disabled,
}: FormFieldProps) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPass ? "text" : "password") : type;
  const hasError = !!error && !!touched;
  const isValid = !!touched && !error && !!value;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          autoComplete={isPassword ? "current-password" : name === "email" ? "email" : "off"}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={[
            "w-full py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
            Icon ? "pl-10" : "pl-3",
            isPassword || isValid || hasError ? "pr-10" : "pr-3",
            hasError
              ? "border-red-400 bg-red-50 focus:ring-red-200"
              : isValid
              ? "border-green-400 bg-green-50/30 focus:ring-green-200"
              : "border-border bg-white focus:ring-blue-200",
          ].join(" ")}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {!isPassword && isValid && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
        )}
        {!isPassword && hasError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 pointer-events-none" />
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
