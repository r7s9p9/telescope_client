import { Dispatch, ReactNode, useEffect, useRef } from "react";

function getStyle(
  size: "sm" | "md" | "xl",
  leftSection: boolean,
  rightSection: boolean,
) {
  let textSize;
  let sectionOffset;
  let paddingLeft = 0;
  let paddingRight = 0;

  switch (size) {
    case "sm":
      textSize = "text-sm";
      sectionOffset = 8;
      if (leftSection) {
        paddingLeft = 36;
      } else {
        paddingLeft = 8;
      }
      if (rightSection) {
        paddingRight = 36;
      } else {
        paddingRight = 8;
      }
      break;
    case "md":
      textSize = "text-lg";
      sectionOffset = 10;
      if (leftSection) {
        paddingLeft = 48;
      } else {
        paddingLeft = 12;
      }
      if (rightSection) {
        paddingRight = 48;
      } else {
        paddingRight = 12;
      }
      break;
    case "xl":
      textSize = "text-2xl";
      sectionOffset = 18;
      if (leftSection) {
        paddingLeft = 64;
      } else {
        paddingLeft = 16;
      }
      if (rightSection) {
        paddingRight = 64;
      } else {
        paddingRight = 16;
      }
      break;
  }
  return { textSize, sectionOffset, paddingLeft, paddingRight };
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
}) {
  const { textSize, sectionOffset, paddingLeft, paddingRight } = getStyle(
    size,
    !!leftSection,
    !!rightSection,
  );

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
        target.style.height = `${target.scrollHeight}px`;
      } else {
        target.style.height = `${(Number(target.scrollHeight) / allRowsCount) * maxRows}px`;
      }
    }
  }, [textAreaRef, heightDetectorRef, maxRows, value]);

  return (
    <div className={`relative shrink-0 w-full`}>
      {leftSection && (
        <div
          style={{ left: sectionOffset, bottom: sectionOffset }}
          className={`absolute h-full flex items-end`}
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
        style={{ paddingLeft, paddingRight }}
        className={`${textSize} font-light ${unstyled ? "" : "ring-2 ring-slate-200"} resize-none h-full w-full outline-none text-gray-800 bg-slate-100 rounded-md enabled:hover:ring-slate-400 enabled:hover:bg-slate-50 enabled:hover:rounded-xl focus:ring-slate-400 focus:bg-slate-50 focus:rounded-xl duration-300 ease-in-out`}
      />
      <p
        ref={heightDetectorRef}
        className={`${textSize} font-light opacity-0 absolute top-0 select-none`}
      >
        &nbsp;
      </p>
      {rightSection && (
        <div
          style={{ right: sectionOffset, bottom: sectionOffset }}
          className={`absolute h-full flex items-end`}
        >
          {rightSection}
        </div>
      )}
    </div>
  );
}
