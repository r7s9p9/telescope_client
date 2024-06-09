import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Overlay } from "../../shared/ui/Overlay/Overlay";

const PopupContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  show: (_content: JSX.Element) => {},
  hide: () => {},
});

const PopupViewContext = createContext({
  isShow: false,
  content: <></>,
});

// eslint-disable-next-line react-refresh/only-export-components
export const usePopup = () => useContext(PopupContext);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({
    isShow: false,
    content: <></>,
  });

  const show = (content: JSX.Element) => setData({ isShow: true, content });
  const hide = () => setData((data) => ({ ...data, isShow: false }));

  return (
    <PopupContext.Provider value={{ show, hide }}>
      <PopupViewContext.Provider value={data}>
        {children}
      </PopupViewContext.Provider>
    </PopupContext.Provider>
  );
}

export const PopupStack = () => {
  const data = useContext(PopupViewContext);
  const { hide } = useContext(PopupContext);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        data.isShow &&
        overlayRef.current &&
        overlayRef.current.contains(event.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        hide();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [data, hide, contentRef]);

  return (
    data.isShow && (
      <Overlay overlayRef={overlayRef} contentRef={contentRef}>
        {data.content}
      </Overlay>
    )
  );
};
