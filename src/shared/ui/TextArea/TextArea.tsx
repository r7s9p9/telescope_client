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
        (target.scrollHeight - 2 * padding) / detector.clientHeight,
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
        //target.scrollTop = target.scrollHeight;
      }
    }
  }, [textAreaRef, heightDetectorRef, maxRows, padding, value, height]);

  return (
    <div className="relative grow shrink-0 flex w-full">
      {leftSection && (
        <div
          style={{
            height,
            gap: padding,
            padding,
          }}
          className="absolute right-0 bottom-0 flex items-center justify-around"
        >
          {leftSection}
        </div>
      )}
      <textarea
        ref={textAreaRef}
        value={value}
        placeholder={placeholder}
        rows={minRows}
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
        aria-expanded={true}
        autoComplete="off"
        disabled={disabled}
        style={{
          // Since the height also determines the width of the left and right sections,
          // we set the same indentation because the section has the position: absolute property
          paddingLeft: leftSection ? height : padding,
          paddingRight: rightSection ? height : padding,
          paddingBottom: padding,
          paddingTop: padding,
          height,
        }}
        className={`${textSize} font-light ${unstyled ? "" : "ring-2 ring-slate-200"} resize-none h-auto w-full outline-none bg-slate-100 rounded-md enabled:hover:ring-slate-400 enabled:hover:bg-slate-50 enabled:hover:rounded-xl focus:ring-slate-400 focus:bg-slate-50 focus:rounded-xl duration-300 ease-in-out ${className || ""}`}
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
