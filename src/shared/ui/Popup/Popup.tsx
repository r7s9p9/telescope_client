import { ReactNode, RefObject } from "react";
import { Overlay } from "../Overlay/Overlay";
import { Paper } from "../Paper/Paper";
import { Text } from "../Text/Text";
import { IconButton } from "../IconButton/IconButton";
import { IconX } from "@tabler/icons-react";

export function Popup({
  children,
  titleText,
  rightSection,
  contentRef,
  overlayRef,
  onClose,
}: {
  children: ReactNode;
  titleText: string;
  rightSection?: ReactNode;
  contentRef?: RefObject<HTMLDivElement>;
  overlayRef?: RefObject<HTMLDivElement>;
  onClose: () => void;
}) {
  const iconProps = {
    className: "text-slate-600",
    strokeWidth: "1",
    size: 32,
  };

  return (
    <Overlay contentRef={contentRef} overlayRef={overlayRef}>
      <Paper
        padding={4}
        shadow="xl"
        className="h-full w-full rounded-t-xl md:rounded-xl flex flex-col bg-slate-50"
      >
        <div className="pb-2 shrink-0 flex items-center gap-2">
          <Text
            size="xl"
            font="thin"
            uppercase
            letterSpacing
            className="select-none grow"
          >
            {titleText}
          </Text>
          {rightSection}
          <IconButton title="Exit" onClick={onClose}>
            <IconX {...iconProps} />
          </IconButton>
        </div>
        <div className="w-full border-2 border-slate-100" />
        {children}
      </Paper>
    </Overlay>
  );
}
