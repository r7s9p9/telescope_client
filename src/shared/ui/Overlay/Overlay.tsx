import { ReactNode, RefObject } from "react";

export function Overlay({
  children,
  overlayRef,
  contentRef,
}: {
  children: ReactNode;
  overlayRef?: RefObject<HTMLDivElement>;
  contentRef?: RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={overlayRef}
      className={`z-10 absolute left-0 top-0 w-screen h-screen flex items-center justify-center backdrop-blur-sm bg-opacity-50 bg-gray-600`}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
