import { useCallback, useEffect, useRef } from "react";

export function useOnClickOutside({
  onClickOutside,
  detectWithoutOverlayRef,
}: {
  onClickOutside: () => void;
  detectWithoutOverlayRef?: boolean;
}) {
  // Why two useRef?
  //
  // There may be situations where the elements displayed on the screen
  // are not children of contentRef.target. To exclude false positives
  // clicks that occur when clicking on a (for example) notification,
  // you need to exclude it from checking using overlayRef. If a click
  // occurs on the overlayRef.current child element but not on the
  // contentRef.target child element, we execute a callback.
  //
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      const isOutsideContent =
        contentRef.current &&
        !contentRef.current.contains(event.target as Node);

      if (detectWithoutOverlayRef && isOutsideContent) {
        onClickOutside();
        return;
      }

      const isInsideOverlay =
        overlayRef.current && overlayRef.current.contains(event.target as Node);

      if (isOutsideContent && isInsideOverlay) {
        onClickOutside();
        return;
      }
    },
    [detectWithoutOverlayRef, onClickOutside],
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onClickOutside, overlayRef, contentRef, handleClick]);

  return { overlayRef, contentRef };
}
