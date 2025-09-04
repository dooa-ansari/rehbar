import { ChangeEvent } from "react";

interface InputProps {
  placeHolder: string;
  defaultValue?: string;
  type?: string;
  onChange: (value: string) => void;
  name: string;
  for?: string;
}

const Input: React.FC<InputProps> = ({
  placeHolder,
  type = "text",
  onChange,
}) => {
  return (
    <div className="input-margin flex-1">
      <input
        placeholder={placeHolder}
        type={type}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
      />
    </div>
  );
};

export default Input;
