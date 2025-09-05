import { ChangeEvent, useState, FocusEvent } from "react";

interface InputProps {
  placeHolder: string;
  defaultValue?: string;
  type?: string;
  onChange: (value: string) => void;
  name: string;
  htmlFor?: string;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const Input: React.FC<InputProps> = ({
  placeHolder,
  type = "text",
  onChange,
  htmlFor,
  required = false,
  defaultValue,
  onValidationChange,
}) => {
  const [error, setError] = useState("");

  const validate = (val: string) => {
    if (required && !val.trim()) {
      return "This field is required.";
    }
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (val && !emailRegex.test(val)) {
        return "Please enter a valid email.";
      }
    }
    return "";
  };
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const errorMsg = validate(val);
    setError(errorMsg);
    onChange(val);
    onValidationChange?.(!errorMsg);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const errorMsg = validate(val);
    setError(errorMsg);
  };

  return (
    <div className="flex-1">
      <label htmlFor={htmlFor}>
        {placeHolder} {required && <span className="text-required">*</span>}
      </label>
      <input
        required={required}
        type={type}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error && <p className="validation-error">{error}</p>}
    </div>
  );
};

export default Input;
