import { Dispatch, ReactNode, useState } from "react";
import { Input } from "../Input/Input";
import { Text } from "../Text/Text";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";

export function InputField({
  disabled,
  value,
  setValue,
  label,
  sensitive,
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
  sensitive?: boolean;
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

  const [show, setShow] = useState(!sensitive);

  if (sensitive) {
    rightSection = (
      <>
        <IconEyeClosed
          onClick={() => setShow(true)}
          size={28}
          className={`cursor-pointer text-slate-500 duration-300 ease-in-out ${!show ? "z-10 opacity-100" : "z-0 opacity-0"}`}
          strokeWidth="1"
        />
        <IconEye
          onClick={() => setShow(false)}
          size={28}
          className={`absolute cursor-pointer text-slate-500 duration-300 ease-in-out ${show ? "z-10 opacity-100" : "z-0 opacity-0"}`}
          strokeWidth="1"
        />
      </>
    );
  }

  return (
    <div className={`${padding ? `p-${padding}` : ""} ${className || ""}`}>
      <div className="flex flex-wrap justify-between items-end py-1">
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
        type={sensitive ? (show ? "text" : "password") : "text"}
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
