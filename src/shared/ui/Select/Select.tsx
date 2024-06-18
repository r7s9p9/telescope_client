import { Dispatch, ReactNode } from "react";

function getStyle(size: "sm" | "md" | "xl") {
  let height;
  let textSize;
  let padding = 0;

  switch (size) {
    case "sm":
      height = 32;
      padding = 6;
      textSize = "text-sm";
      break;
    case "md":
      height = 48;
      padding = 10;
      textSize = "text-lg";
      break;
    case "xl":
      height = 64;
      padding = 14;
      textSize = "text-2xl";
      break;
  }
  return {
    height,
    padding,
    textSize,
  };
}

export function Select({
  children,
  value,
  setValue,
  size,
  unstyled,
  disabled,
  className,
}: {
  children: ReactNode;
  value: string;
  setValue: Dispatch<string>;
  size: "sm" | "md" | "xl";
  unstyled?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const { height, textSize, padding } = getStyle(size);

  return (
    <select
      disabled={disabled}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      style={{ height, paddingLeft: padding, paddingRight: padding }}
      className={`${textSize} ${unstyled ? "" : "ring-2 ring-slate-200"} appearance-none w-fit outline-none ${!disabled ? "cursor-pointer" : ""} font-light bg-slate-100 rounded-md enabled:hover:ring-slate-400 enabled:hover:bg-slate-50 enabled:hover:rounded-xl enabled:hover:focus:ring-slate-400 enabled:hover:focus:bg-slate-50 enabled:hover:focus:rounded-xl duration-300 ease-in-out ${className || ""}`}
    >
      {children}
    </select>
  );
}
