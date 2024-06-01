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
  const { height, textSize, padding } = getStyle(size);

  return (
    <div className="relative shrink-0 w-full">
      {leftSection && (
        <div
          // The content is in a square with a side equal to the height of the component
          style={{ width: height, height }}
          className="absolute left-0 bottom-0 flex items-center justify-center"
        >
          {leftSection}
        </div>
      )}
      <input
        value={value}
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
        className={`${textSize} ${unstyled ? "" : "ring-2 ring-slate-200"} h-full w-full outline-none font-light text-gray-800 bg-slate-100 rounded-md enabled:hover:ring-slate-400 enabled:hover:bg-slate-50 enabled:hover:rounded-xl focus:ring-slate-400 focus:bg-slate-50 focus:rounded-xl duration-300 ease-in-out`}
      ></input>
      {rightSection && (
        <div
          // The content is in a square with a side equal to the height of the component
          style={{ width: height, height }}
          className="absolute right-0 bottom-0 flex items-center justify-center"
        >
          {rightSection}
        </div>
      )}
    </div>
  );
}
