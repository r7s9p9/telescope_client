import { ReactNode } from "react";
import { Spinner } from "../Spinner/Spinner";

export function IconButton({
  children,
  title,
  type,
  noHover,
  disabled,
  loading,
  loaderType,
  loaderSize,
  className,
  buttonRef,
  style,
  formNoValidate,
  onClick,
}: {
  children: ReactNode;
  title: string;
  type?: "submit" | "button" | "reset";
  noHover?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loaderType?: "pulse" | "outside" | "replace";
  loaderSize?: number;
  // outside loaderType only for icons
  className?: string;
  buttonRef?: React.MutableRefObject<HTMLButtonElement | null>;
  style?: React.CSSProperties;
  formNoValidate?: boolean;
  onClick?: () => void;
}) {
  const Loader = (
    <Spinner
      size={loaderSize || 24}
      className={`${loaderType === "outside" ? "absolute z-10" : ""}`}
    />
  );

  let Content: ReactNode;
  if (loading && loaderType === "replace") {
    Content = Loader;
  } else {
    Content = children;
  }

  return (
    <div
      style={style}
      className={`${loaderType === "pulse" && loading ? "animate-pulse" : ""} flex justify-center items-center duration-300 ease-in-out`}
    >
      <button
        title={title}
        disabled={loading || disabled}
        type={type}
        ref={buttonRef}
        onClick={onClick}
        formNoValidate={formNoValidate}
        className={`${loading || disabled ? "" : "cursor-pointer"} ${!noHover ? "hover:bg-slate-200 p-1" : ""} rounded-full flex items-center justify-center opacity-75 hover:opacity-100 duration-300 ease-in-out ${className || ""}`}
      >
        {Content}
      </button>
      {loaderType === "outside" && loading && Loader}
    </div>
  );
}
