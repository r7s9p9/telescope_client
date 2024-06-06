import { Dispatch, ReactNode, useEffect, useRef } from "react";

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

export function TextArea({
  minRows = 1,
  maxRows,
  value,
  setValue,
  size,
  placeholder,
  leftSection,
  rightSection,
  unstyled,
  disabled,
  className,
}: {
  minRows?: number;
  maxRows: number;
  value: string;
  setValue: Dispatch<string>;
  size: "sm" | "md" | "xl";
  placeholder?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  unstyled?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const { height, padding, textSize } = getStyle(size);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const heightDetectorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textAreaRef.current && heightDetectorRef.current) {
      const target = textAreaRef.current;
      const detector = heightDetectorRef.current;
      target.style.height = "auto";

      const allRowsCount = Math.floor(
        target.scrollHeight / detector.clientHeight,
      );

      if (allRowsCount <= maxRows) {
        if (target.scrollHeight < height) {
          // for height with 1 row
          target.style.height = `${height}px`;
        } else {
          // for height with 1+ row
          target.style.height = `${detector.clientHeight * allRowsCount + 2 * padding}px`;
        }
      } else {
        // to hold the maximum specified number of rows
        target.style.height = `${detector.clientHeight * maxRows + 2 * padding}px`;
      }
    }
  }, [textAreaRef, heightDetectorRef, maxRows, padding, value, height]);

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
      <textarea
        ref={textAreaRef}
        rows={minRows}
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
        aria-multiline={true}
        aria-expanded={true}
        autoComplete="off"
        placeholder={placeholder || ""}
        disabled={disabled}
        style={{
          // Since the height also determines the width of the left and right sections,
          // we set the same indentation because the section has the position: absolute property
          paddingLeft: leftSection ? height : padding,
          paddingRight: rightSection ? height : padding,
          paddingBottom: padding,
          paddingTop: padding,
        }}
        className={`${textSize} font-light ${unstyled ? "" : "ring-2 ring-slate-200"} resize-none h-full w-full outline-none bg-slate-100 rounded-md enabled:hover:ring-slate-400 enabled:hover:bg-slate-50 enabled:hover:rounded-xl focus:ring-slate-400 focus:bg-slate-50 focus:rounded-xl duration-300 ease-in-out ${className || ""}`}
      />
      <p
        // Defines the height of one line of the same font as <textarea />
        ref={heightDetectorRef}
        className={`${textSize} font-light opacity-0 absolute top-0 select-none`}
      >
        &nbsp;
      </p>
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
