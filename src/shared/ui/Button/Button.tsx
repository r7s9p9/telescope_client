import { ReactNode } from "react";

function getStyle(size: "sm" | "md" | "xl") {
  let height;

  switch (size) {
    case "sm":
      height = 32;
      break;
    case "md":
      height = 48;
      break;
    case "xl":
      height = 64;
      break;
  }
  return {
    height,
  };
}

export function Button({
  children,
  title,
  size,
  type = "button",
  padding = 2,
  gap = 2,
  unstyled,
  disabled,
  className,
  buttonRef,
  formNoValidate,
  onClick,
}: {
  children: ReactNode;
  title: string;
  size: "sm" | "md" | "xl";
  type?: "submit" | "button" | "reset";
  padding?: number;
  gap?: number;
  unstyled?: boolean;
  disabled?: boolean;
  className?: string;
  buttonRef?: React.MutableRefObject<HTMLButtonElement | null>;
  style?: React.CSSProperties;
  formNoValidate?: boolean;
  onClick?: () => void;
}) {
  const { height } = getStyle(size);

  return (
    <button
      title={title}
      disabled={disabled}
      type={type}
      ref={buttonRef}
      onClick={onClick}
      formNoValidate={formNoValidate}
      style={{ height, padding }}
      className={`${gap ? `gap-${gap}` : ""} ${unstyled ? "" : "bg-slate-100 ring-2 ring-slate-200 enabled:hover:ring-slate-400 enabled:hover:bg-slate-50 enabled:hover:rounded-xl rounded-md"} flex items-center duration-300 ease-in-out ${className || ""}`}
    >
      {children}
    </button>
  );
}
