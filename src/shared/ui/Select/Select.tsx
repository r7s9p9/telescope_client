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
}: {
  children: ReactNode;
  value: string;
  setValue: Dispatch<string>;
  size: "sm" | "md" | "xl";
  unstyled?: boolean;
  disabled?: boolean;
}) {
  const { height, textSize, padding } = getStyle(size);

  return (
    <div className="relative shrink-0 w-full">
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        style={{ height, paddingLeft: padding, paddingRight: padding }}
        className={`${textSize} text-center ${unstyled ? "" : "ring-2 ring-slate-200"} appearance-none h-full w-fit outline-none ${!disabled ? "cursor-pointer" : ""} font-light text-gray-800 bg-slate-100 rounded-md enabled:hover:ring-slate-400 enabled:hover:bg-slate-50 enabled:hover:rounded-xl focus:ring-slate-400 focus:bg-slate-50 focus:rounded-xl duration-300 ease-in-out`}
      >
        {children}
      </select>
    </div>
  );
}
