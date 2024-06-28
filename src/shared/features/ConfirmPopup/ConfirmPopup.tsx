import { ReactNode, createContext, useContext, useState } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { Popup } from "../../ui/Popup/Popup";
import { Text } from "../../ui/Text/Text";
import { Button } from "../../ui/Button/Button";

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

function ConfirmPopupContent({
  onAgree,
  onClose,
  text,
}: {
  onAgree: () => void;
  onClose: () => void;
  text: {
    question: string;
    confirm: string;
    cancel: string;
  };
}) {
  return (
    <>
      <Text
        size={"xl"}
        font="light"
        className="m-auto text-center overflow-y-auto"
      >
        {text.question}
      </Text>
      <div className="w-full border-t-2 border-slate-100" />
      <div className="mt-4 w-full flex flex-col md:flex-row justify-center items-between gap-4">
        <Button
          size="md"
          title="Confirm"
          onClick={() => {
            onAgree();
            onClose();
          }}
          unstyled
          className="w-full items-center justify-center ring-2 ring-slate-200 rounded-lg hover:bg-slate-200"
        >
          <Text
            size="md"
            font="light"
            uppercase
            letterSpacing
            className="text-red-600"
          >
            {text.confirm}
          </Text>
        </Button>
        <Button
          size="md"
          title="Cancel"
          onClick={() => {
            onClose();
          }}
          unstyled
          className="w-full items-center justify-center ring-2 ring-slate-200 rounded-lg hover:bg-slate-200"
        >
          <Text size="md" font="light" uppercase letterSpacing>
            {text.cancel}
          </Text>
        </Button>
      </div>
    </>
  );
}
