import { Dispatch, ReactNode } from "react";

function getStyle(
  size: "sm" | "md" | "xl",
  leftSection: boolean,
  rightSection: boolean,
) {
  let height;
  let textSize;
  let sectionOffset;
  let paddingLeft = 0;
  let paddingRight = 0;

  switch (size) {
    case "sm":
      height = 24;
      textSize = "text-sm";
      sectionOffset = 8;
      if (leftSection) {
        paddingLeft = 32;
      } else {
        paddingLeft = 8;
      }
      if (rightSection) {
        paddingRight = 32;
      } else {
        paddingRight = 8;
      }
      break;
    case "md":
      height = 48;
      textSize = "text-lg";
      sectionOffset = 12;
      if (leftSection) {
        paddingLeft = 42;
      } else {
        paddingLeft = 12;
      }
      if (rightSection) {
        paddingRight = 42;
      } else {
        paddingRight = 12;
      }
      break;
    case "xl":
      height = 64;
      textSize = "text-2xl";
      sectionOffset = 18;
      if (leftSection) {
        paddingLeft = 48;
      } else {
        paddingLeft = 16;
      }
      if (rightSection) {
        paddingRight = 48;
      } else {
        paddingRight = 16;
      }
      break;
  }
  return { height, textSize, sectionOffset, paddingLeft, paddingRight };
}

export function Input({
  value,
  setValue,
  size,
  placeholder,
  leftSection,
  rightSection,
  unstyled,
  disabled,
}: {
  value: string;
  setValue: Dispatch<string>;
  size: "sm" | "md" | "xl";
  placeholder?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  unstyled?: boolean;
  disabled?: boolean;
}) {
  const { height, textSize, sectionOffset, paddingLeft, paddingRight } =
    getStyle(size, !!leftSection, !!rightSection);

  return (
    <div style={{ height }} className={`relative shrink-0 w-full`}>
      {leftSection && (
        <div
          style={{ left: sectionOffset }}
          className={`absolute top-0 h-full flex items-center`}
        >
          {leftSection}
        </div>
      )}
      <input
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        disabled={disabled}
        placeholder={placeholder}
        style={{ paddingLeft, paddingRight }}
        className={`${textSize} ${unstyled ? "" : "ring-2 ring-slate-200"} h-full w-full outline-none font-light text-gray-800 bg-slate-100 rounded-md enabled:hover:ring-slate-400 enabled:hover:bg-slate-50 enabled:hover:rounded-xl focus:ring-slate-400 focus:bg-slate-50 focus:rounded-xl duration-300 ease-in-out`}
      ></input>
      {rightSection && (
        <div
          style={{ right: sectionOffset }}
          className={`absolute top-0 h-full flex items-center`}
        >
          {rightSection}
        </div>
      )}
    </div>
  );
}
