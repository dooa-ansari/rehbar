type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  text: string;
  variant: ButtonVariant;
  onClick: () => void;
  className?: string;
}

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
};

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant,
  className,
}) => {
  return (
    <button
      className={`button ${variants[variant]} ${className || ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
