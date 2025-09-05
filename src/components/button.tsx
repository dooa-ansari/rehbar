type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  text: string;
  variant: ButtonVariant;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const variants = {
  primary: "button-primary",
  secondary: "button-secondary",
  outline: "button-outline",
};

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant,
  className,
  disabled,
}) => {
  return (
    <button
      className={`button ${variants[variant]} ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
