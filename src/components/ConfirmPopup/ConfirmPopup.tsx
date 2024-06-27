import { ReactNode, createContext, useContext, useState } from "react";
import { useOnClickOutside } from "../../shared/hooks/useOnClickOutside";
import { Popup } from "../../shared/ui/Popup/Popup";
import { ConfirmPopupContent } from "../../shared/ui/ConfirmPopupContent/ConfirmPopupContent";

const defaultData = {
  text: {
    question: "",
    confirm: "",
    cancel: "",
  },
  onAgree: () => {},
  onClose: () => {},
};

const ConfirmPopupContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  show: (_options: typeof defaultData) => {},
  hide: () => {},
});

const ConfirmPopupViewContext = createContext({
  isShow: false,
  options: defaultData,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useConfirmPopup = () => useContext(ConfirmPopupContext);

export function ConfirmPopupProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({
    isShow: false,
    options: defaultData,
  });

  const show = (options: typeof defaultData) =>
    setData({ isShow: true, options });
  const hide = () => setData((data) => ({ ...data, isShow: false }));

  return (
    <ConfirmPopupContext.Provider value={{ show, hide }}>
      <ConfirmPopupViewContext.Provider value={data}>
        {children}
      </ConfirmPopupViewContext.Provider>
    </ConfirmPopupContext.Provider>
  );
}

export const PopupStack = () => {
  const data = useContext(ConfirmPopupViewContext);
  const { hide } = useContext(ConfirmPopupContext);
  const { overlayRef, contentRef } = useOnClickOutside({ onClose: hide });

  return (
    data.isShow && (
      <Popup
        titleText="Confirmation"
        overlayRef={overlayRef}
        contentRef={contentRef}
        onClose={data.options.onClose}
      >
        <ConfirmPopupContent
          onAgree={data.options.onAgree}
          onClose={data.options.onClose}
          text={data.options.text}
        />
      </Popup>
    )
  );
};
