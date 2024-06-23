import { ForwardedRef, ReactNode, forwardRef } from "react";

export const Paper = forwardRef(function Paper(
  {
    children,
    padding,
    rounded,
    shadow,
    inList,
    style,
    className,
    onContextMenu,
  }: {
    children?: ReactNode;
    padding?: number;
    rounded?: "sm" | "md" | "lg" | "xl";
    shadow?: "sm" | "md" | "lg" | "xl";
    inList?: boolean;
    style?: React.CSSProperties;
    className?: string;
    onContextMenu?: React.MouseEventHandler<HTMLDivElement | HTMLLIElement>;
  },
  ref?: ForwardedRef<HTMLDivElement | HTMLLIElement>,
) {
  return (
    <>
      {inList && (
        <li
          style={style}
          onContextMenu={
            onContextMenu as React.MouseEventHandler<HTMLLIElement>
          }
          ref={ref as ForwardedRef<HTMLLIElement>}
          className={`bg-slate-100 ${rounded && `rounded-${rounded}`} ${shadow && `shadow-${shadow}`} ${padding && `p-${padding}`} ${className || ""}`}
        >
          {children || ""}
        </li>
      )}
      {!inList && (
        <div
          style={style}
          onContextMenu={
            onContextMenu as React.MouseEventHandler<HTMLDivElement>
          }
          ref={ref as ForwardedRef<HTMLDivElement>}
          className={`bg-slate-100 ${rounded && `rounded-${rounded}`} ${shadow && `shadow-${shadow}`} ${padding && `p-${padding}`} ${className || ""}`}
        >
          {children || ""}
        </div>
      )}
    </>
  );
});
