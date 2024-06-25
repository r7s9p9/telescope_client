import { ReactNode, createContext, useContext, useState } from "react";
import { Overlay } from "../../shared/ui/Overlay/Overlay";
import { useOnClickOutside } from "../../shared/hooks/useOnClickOutside";

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
  const { overlayRef, contentRef } = useOnClickOutside({ onClose: hide });

  return (
    data.isShow && (
      <Overlay overlayRef={overlayRef} contentRef={contentRef}>
        {data.content}
      </Overlay>
    )
  );
};
