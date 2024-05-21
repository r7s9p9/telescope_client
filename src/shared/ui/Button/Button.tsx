import { ReactNode } from "react";

export function Button({
  children,
  title,
  type,
  rounded,
  noHover,
  disabled,
  loading,
  loaderType,
  className,
  buttonRef,
  style,
  onClick,
}: {
  children: ReactNode;
  title: string;
  type?: "submit" | "button" | "reset";
  rounded?: "default" | "full";
  noHover?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loaderType?: "pulse" | "outside" | "replace";
  // outside loaderType only for icons
  className?: string;
  buttonRef?: React.MutableRefObject<HTMLButtonElement | null>;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const Loader = (
    <div
      className={`${loaderType === "outside" ? "absolute z-10" : ""} ${loaderType === "replace" ? "aspect-square size-8" : "w-full h-full"} rounded-full border-x-2 border-slate-300 animate-spin`}
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
        className={`${loading || disabled ? "" : "cursor-pointer"} ${rounded === "default" ? "rounded-lg" : ""} ${rounded === "full" ? "rounded-full" : ""} ${!noHover ? "hover:bg-slate-200 p-1" : ""} h-full flex items-center opacity-75 hover:opacity-100 duration-300 ease-in-out ${className || ""}`}
      >
        {Content}
      </button>
      {loaderType === "outside" && loading && Loader}
    </div>
  );
}
