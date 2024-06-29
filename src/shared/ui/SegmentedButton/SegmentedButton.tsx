import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  JSX,
} from "react";
import { Text } from "../Text/Text";
import { delay } from "../../lib/delay";

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
  return { height };
}

export function SegmentedButton({
  elements,
  elementClassName,
  onSelected,
  defaultValue,
  type,
  className,
  label,
  padding,
  size,
}: {
  elements: { label: JSX.Element; value: string }[];
  elementClassName?: string;
  // eslint-disable-next-line no-unused-vars
  onSelected: (value: string) => void;
  defaultValue?: string;
  type: "horizontal" | "vertical";
  className?: string;
  label?: string;
  padding?: number;
  size: "sm" | "md" | "xl";
}) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const selectorRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const elementsRef: RefObject<HTMLLIElement>[] = [];
  const elementsResult: ReactNode[] = [];

  const { height } = getStyle(size);

  let count = 0;
  for (const element of elements) {
    // to unbind a variable reference from the count variable
    const index = count;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const elementRef = useRef<HTMLLIElement>(null);
    elementsRef.push(elementRef);
    elementsResult.push(
      <li
        ref={elementRef}
        key={count}
        style={{ height }}
        className={`${elementClassName || ""} cursor-pointer select-none grow flex items-center justify-center p-2 gap-2 rounded-lg hover:rounded-xl hover:bg-slate-200 duration-500 ease-in-out`}
        onClick={() => {
          setSelectedIndex(index);
          onSelected(element.value);
        }}
      >
        {element.label}
      </li>,
    );
    count++;
  }

  useEffect(() => {
    if (defaultValue) {
      let index = 0;
      for (const element of elements) {
        if (element.value === defaultValue) setSelectedIndex(index);
        index++;
      }
    }
    // add listener for onresize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calcSelector = useCallback(() => {
    if (selectorRef?.current && elementsRef[selectedIndex]?.current) {
      selectorRef.current.style.width = `${elementsRef[selectedIndex].current?.clientWidth}px`;
      selectorRef.current.style.height = `${elementsRef[selectedIndex].current?.clientHeight}px`;
      selectorRef.current.style.left = `${elementsRef[selectedIndex].current?.offsetLeft}px`;
      selectorRef.current.style.top = `${elementsRef[selectedIndex].current?.offsetTop}px`;
    }
  }, [selectorRef, elementsRef, selectedIndex]);

  const setSelectorVisibility = useCallback(
    (enable: boolean) => {
      if (selectorRef?.current) {
        if (enable) selectorRef.current.style.opacity = "1";
        if (!enable) selectorRef.current.style.opacity = "0";
      }
    },
    [selectorRef],
  );

  useEffect(() => {
    calcSelector();
    setSelectorVisibility(true);
  }, [calcSelector, setSelectorVisibility]);

  const handleResize = useCallback(async () => {
    if (selectorRef.current) {
      setSelectorVisibility(false);
      calcSelector();
      await delay(500);
      if (selectorRef.current.style.opacity === "0") {
        calcSelector();
        setSelectorVisibility(true);
      }
    }
  }, [setSelectorVisibility, calcSelector]);

  onresize = () => {
    handleResize();
  };

  return (
    <div
      className={`relative ${padding ? `p-${padding}` : ""} ${className || ""}`}
    >
      {label && (
        <Text size={size} font="light" className="w-full py-1">
          {label}
        </Text>
      )}
      <div
        ref={selectorRef}
        className={`z-10 absolute opacity-0 ring-2 ring-slate-400 rounded-lg duration-200 ease-in-out`}
      />
      <ul
        className={`${className || ""} flex ${type === "vertical" ? "flex-col" : "flex-row"} w-full justify-between bg-slate-100 rounded-lg ring-2 ring-slate-200 hover:ring-slate-400 hover:rounded-xl duration-500 ease-in-out`}
      >
        {elementsResult}
      </ul>
    </div>
  );
}
