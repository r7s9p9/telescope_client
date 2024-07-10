import { ReactNode } from "react";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { Text } from "../../../shared/ui/Text/Text";
import { Button } from "../../../shared/ui/Button/Button";
import {
  IconDeviceDesktop,
  IconDoorExit,
  IconLanguage,
  IconLock,
  IconUser,
} from "@tabler/icons-react";
import { useSettings } from "./useSettings";
import { useConfirmPopup } from "../../../shared/features/ConfirmPopup/ConfirmPopup";

export function Settings() {
  const { onClickHandler, lang } = useSettings();
  const confirmPopup = useConfirmPopup();

  const iconProps = {
    strokeWidth: "1",
    className: "ml-1 text-slate-600",
    size: 28,
  };

  return (
    <Wrapper>
      <Button
        title={lang.settings.ITEM_PROFILE}
        size="xl"
        unstyled
        onClick={onClickHandler().profile}
        className="gap-4 hover:bg-slate-200 border-b-2 md:border-0 border-slate-100 md:rounded-t-lg"
      >
        <IconUser {...iconProps} />
        <Text
          size="md"
          font="light"
          uppercase
          letterSpacing
          className="select-none"
        >
          {lang.settings.ITEM_PROFILE}
        </Text>
      </Button>
      <Button
        title={lang.settings.ITEM_PRIVACY}
        size="xl"
        unstyled
        onClick={onClickHandler().privacy}
        className="gap-4 hover:bg-slate-200 border-b-2 md:border-0 border-slate-100"
      >
        <IconLock {...iconProps} />
        <Text
          size="md"
          font="light"
          uppercase
          letterSpacing
          className="select-none"
        >
          {lang.settings.ITEM_PRIVACY}
        </Text>
      </Button>
      <Button
        title={lang.settings.ITEM_SESSIONS}
        size="xl"
        unstyled
        onClick={onClickHandler().sessions}
        className="gap-4 hover:bg-slate-200 border-b-2 md:border-0 border-slate-100"
      >
        <IconDeviceDesktop {...iconProps} />
        <Text
          size="md"
          font="light"
          uppercase
          letterSpacing
          className="select-none"
        >
          {lang.settings.ITEM_SESSIONS}
        </Text>
      </Button>
      <Button
        title={lang.settings.ITEM_LANG}
        size="xl"
        unstyled
        onClick={onClickHandler().language}
        className="gap-4 hover:bg-slate-200 border-b-2 md:border-0 border-slate-100"
      >
        <IconLanguage {...iconProps} />
        <Text
          size="md"
          font="light"
          uppercase
          letterSpacing
          className="select-none"
        >
          {lang.settings.ITEM_LANG}
        </Text>
      </Button>
      <Button
        title={lang.settings.ITEM_LOGOUT}
        size="xl"
        unstyled
        onClick={() => {
          confirmPopup.show({
            onAgree: onClickHandler().logout,
            onClose: confirmPopup.hide,
            text: {
              title: lang.settings.LOGOUT_POPUP_TITLE,
              question: lang.settings.LOGOUT_POPUP_QUESTION,
              confirm: lang.settings.LOGOUT_POPUP_CONFIRM,
              cancel: lang.settings.LOGOUT_POPUP_CANCEL,
            },
          });
        }}
        className="gap-4 hover:bg-slate-200 md:rounded-b-lg"
      >
        <IconDoorExit {...iconProps} className="text-red-600 ml-1" />
        <Text
          size="md"
          font="light"
          uppercase
          letterSpacing
          className="select-none text-red-600"
        >
          {lang.settings.ITEM_LOGOUT}
        </Text>
      </Button>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full md:w-full h-full md:h-fit self-center flex items-center justify-center border-t-2 border-slate-100 md:border-0">
      <Paper className="h-full w-full md:w-fit md:p-4 flex flex-col justify-center md:rounded-xl shadow-md bg-slate-50">
        {children}
      </Paper>
    </div>
  );
}
