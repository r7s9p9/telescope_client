import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        data.isShow &&
        overlayRef.current &&
        overlayRef.current.contains(event.target as Node) &&
        targetRef.current &&
        !targetRef.current.contains(event.target as Node)
      ) {
        hide();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [data, hide, targetRef]);

  return (
    <div
      ref={overlayRef}
      className={`${data.isShow ? "opacity-100 z-10" : "hidden"} absolute w-screen h-screen flex justify-center items-center backdrop-blur-sm bg-opacity-50 bg-gray-600`}
    >
      {data.isShow && <div ref={targetRef}>{data.content}</div>}
    </div>
  );
};
