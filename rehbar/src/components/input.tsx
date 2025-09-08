import { ChangeEvent, useState, FocusEvent } from "react";
import { useTranslation } from "react-i18next";

type InputType = "password" | "email" | "text";

interface InputProps {
  placeHolder: string;
  defaultValue?: string;
  type?: InputType;
  onChange: (value: string) => void;
  name: string;
  htmlFor?: string;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  minLength?: number;
}

const Input: React.FC<InputProps> = ({
  placeHolder,
  type = "text",
  onChange,
  htmlFor,
  required = false,
  defaultValue,
  onValidationChange,
  minLength = 5,
}) => {
  const [error, setError] = useState("");
  const { t } = useTranslation("validations");

  const validate = (val: string) => {
    if (required && !val.trim()) {
      return t("required");
    }
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (val && !emailRegex.test(val)) {
        return t("email_pattern");
      }
    }

    if (type === "password") {
      if (val && val.length < minLength) {
        return t("password_min_length");
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
        maxLength={25}
      />
      {error && <p className="validation-error">{error}</p>}
    </div>
  );
};

export default Input;
