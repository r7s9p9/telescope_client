import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  CSSProperties,
  MouseEventHandler,
} from "react";

export const Paper = forwardRef(function Paper(
  {
    children,
    padding,
    rounded,
    inList,
    style,
    className,
    onContextMenu,
  }: {
    children?: ReactNode;
    padding?: number;
    rounded?: "sm" | "md" | "lg" | "xl";
    inList?: boolean;
    style?: CSSProperties;
    className?: string;
    onContextMenu?: MouseEventHandler<HTMLDivElement | HTMLLIElement>;
  },
  ref?: ForwardedRef<HTMLDivElement | HTMLLIElement>,
) {
  return (
    <>
      {inList && (
        <li
          style={style}
          onContextMenu={onContextMenu as MouseEventHandler<HTMLLIElement>}
          ref={ref as ForwardedRef<HTMLLIElement>}
          className={`bg-slate-100 ${rounded && `rounded-${rounded}`} ${padding && `p-${padding}`} ${className || ""}`}
        >
          {children || ""}
        </li>
      )}
      {!inList && (
        <div
          style={style}
          onContextMenu={onContextMenu as MouseEventHandler<HTMLDivElement>}
          ref={ref as ForwardedRef<HTMLDivElement>}
          className={`bg-slate-100 ${rounded && `rounded-${rounded}`} ${padding && `p-${padding}`} ${className || ""}`}
        >
          {children || ""}
        </div>
      )}
    </>
  );
});
