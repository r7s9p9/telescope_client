import { Dispatch, ReactNode } from "react";
import { TextArea } from "../TextArea/TextArea";
import { Text } from "../Text/Text";

export function TextAreaField({
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
  minRows,
  maxRows,
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
  minRows?: number;
  maxRows: number;
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
      <TextArea
        minRows={minRows}
        maxRows={maxRows}
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
