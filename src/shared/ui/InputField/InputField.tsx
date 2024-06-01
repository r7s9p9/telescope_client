import { Dispatch, ReactNode } from "react";
import { Input } from "../Input/Input";
import { Text } from "../Text/Text";

export function InputField({
  disabled,
  value,
  setValue,
  label,
  size,
  padding,
  error,
  placeholder,
  leftSection,
  rightSection,
  className,
  unstyled,
}: {
  disabled?: boolean;
  value: string;
  setValue: Dispatch<string>;
  label: string;
  size: "sm" | "md" | "xl";
  padding?: number;
  error?: string;
  placeholder?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  className?: string;
  unstyled?: boolean;
}) {
  let errorTextSize: "sm" | "md";
  switch (size) {
    case "xl":
      errorTextSize = "md";
      break;
    default:
      errorTextSize = "sm";
  }

  return (
    <div className={`${padding ? `p-${padding}` : ""} ${className || ""}`}>
      <div className="flex justify-between items-end py-1">
        <Text size={size} font="light">
          {label}
        </Text>
        {error && (
          <Text size={errorTextSize} font="bold" className="text-red-600">
            {error}
          </Text>
        )}
      </div>
      <Input
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        unstyled={unstyled}
        value={value}
        setValue={setValue}
        leftSection={leftSection}
        rightSection={rightSection}
      />
    </div>
  );
}
