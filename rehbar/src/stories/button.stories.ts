import { Meta, StoryObj } from "@storybook/react";
import Button, { ButtonProps } from "@/components/button";

// Default export
const meta: Meta<ButtonProps> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    onClick: { action: "clicked" },
    variant: {
      control: { type: "radio" },
      options: ["primary", "secondary"], // match ButtonVariant
    },
  },
};

export default meta;

// Use StoryObj pattern instead of StoryFn
type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: {
    text: "Primary Button",
    variant: "primary",
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    text: "Secondary Button",
    variant: "secondary",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    text: "Disabled Button",
    variant: "primary",
    disabled: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    text: "Custom Class",
    variant: "primary",
    className: "my-custom-class",
    disabled: false,
  },
};
