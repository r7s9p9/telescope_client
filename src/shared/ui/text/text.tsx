import { ReactNode } from "react";

export function Text({
  children,
  size,
  font,
  capitalize,
  uppercase,
  className,
  letterSpacing,
}: {
  children: string | ReactNode;
  size: "sm" | "md" | "xl";
  font: "thin" | "light" | "default" | "bold";
  capitalize?: boolean;
  uppercase?: boolean;
  className?: string;
  letterSpacing?: boolean;
}) {
  let textSize;
  let fontStyle;
  switch (size) {
    case "sm":
      textSize = "text-sm";
      break;
    case "md":
      textSize = "text-xl";
      break;
    case "xl":
      textSize = "text-3xl";
      break;
  }
  switch (font) {
    case "thin":
      fontStyle = "font-thin";
      break;
    case "light":
      fontStyle = "font-light";
      break;
    case "default":
      fontStyle = "font-normal";
      break;
    case "bold":
      fontStyle = "font-medium";
      break;
  }

  return (
    <p
      className={`${textSize} ${fontStyle} ${letterSpacing ? "tracking-widest" : ""} ${capitalize ? "capitalize" : ""} ${uppercase ? "uppercase" : ""} ${className || ""}`}
    >
      {children}
    </p>
  );
}
