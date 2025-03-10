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

export function Input({
  value,
  setValue,
  type = "text",
  size,
  placeholder,
  leftSection,
  rightSection,
  unstyled,
  disabled,
  className,
}: {
  value: string;
  setValue: Dispatch<string>;
  type?: "text" | "password";
  size: "sm" | "md" | "xl";
  placeholder?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  unstyled?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const { height, textSize, padding } = getStyle(size);

  return (
    <div className="relative shrink-0 w-full">
      {leftSection && (
        <div
          style={{
            height,
            gap: padding,
            padding,
          }}
          className="absolute left-0 bottom-0 flex items-center justify-around"
        >
          {leftSection}
        </div>
      )}
      <input
        value={value}
        type={type}
        onChange={(e) => setValue(e.currentTarget.value)}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          // Since the height also determines the width of the left and right sections,
          // we set the same indentation because the section has the position: absolute property
          paddingLeft: leftSection ? height : padding,
          paddingRight: rightSection ? height : padding,
          height,
          paddingTop: padding,
          paddingBottom: padding,
        }}
        className={`${textSize} ${unstyled ? "" : "ring-2 ring-slate-200"} h-full w-full bg-slate-100 outline-none font-light rounded-md enabled:hover:ring-slate-400 enabled:hover:bg-slate-50 enabled:hover:rounded-xl focus:ring-slate-400 focus:bg-slate-50 focus:rounded-xl duration-300 ease-in-out ${className || ""}`}
      ></input>
      {rightSection && (
        <div
          style={{
            height,
            gap: padding,
            padding,
          }}
          className="absolute right-0 bottom-0 flex items-center justify-around"
        >
          {rightSection}
        </div>
      )}
    </div>
  );
}
