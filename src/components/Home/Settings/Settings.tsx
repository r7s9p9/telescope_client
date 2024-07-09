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
import { useNotify } from "../../../shared/features/Notification/Notification";
import { langSettings } from "../../../locales/en";

export function Settings() {
  const { onClickHandler } = useSettings();
  const confirmPopup = useConfirmPopup();
  const notify = useNotify();

  const iconProps = {
    strokeWidth: "1",
    className: "ml-1 text-slate-600",
    size: 32,
  };

  return (
    <Wrapper>
      <Button
        title={langSettings.ITEM_PROFILE}
        size="xl"
        unstyled
        onClick={onClickHandler().profile}
        className="gap-4 hover:bg-slate-200 border-b-2 md:border-0 border-slate-100 md:rounded-t-lg"
      >
        <IconUser {...iconProps} />
        <Text
          size="xl"
          font="light"
          uppercase
          letterSpacing
          className="select-none"
        >
          {langSettings.ITEM_PROFILE}
        </Text>
      </Button>
      <Button
        title="Privacy"
        size="xl"
        unstyled
        onClick={onClickHandler().privacy}
        className="gap-4 hover:bg-slate-200 border-b-2 md:border-0 border-slate-100"
      >
        <IconLock {...iconProps} />
        <Text
          size="xl"
          font="light"
          uppercase
          letterSpacing
          className="select-none"
        >
          {langSettings.ITEM_PRIVACY}
        </Text>
      </Button>
      <Button
        title={langSettings.ITEM_SESSIONS}
        size="xl"
        unstyled
        onClick={onClickHandler().sessions}
        className="gap-4 hover:bg-slate-200 border-b-2 md:border-0 border-slate-100"
      >
        <IconDeviceDesktop {...iconProps} />
        <Text
          size="xl"
          font="light"
          uppercase
          letterSpacing
          className="select-none"
        >
          {langSettings.ITEM_SESSIONS}
        </Text>
      </Button>
      <Button
        title={langSettings.ITEM_LANG}
        size="xl"
        unstyled
        onClick={() => {
          notify.show.info("This content is still in development");
        }}
        className="gap-4 hover:bg-slate-200 border-b-2 md:border-0 border-slate-100"
      >
        <IconLanguage {...iconProps} />
        <Text
          size="xl"
          font="light"
          uppercase
          letterSpacing
          className="select-none"
        >
          {langSettings.ITEM_LANG}
        </Text>
      </Button>
      <Button
        title={langSettings.ITEM_LOGOUT}
        size="xl"
        unstyled
        onClick={() => {
          confirmPopup.show({
            onAgree: onClickHandler().logout,
            onClose: confirmPopup.hide,
            text: {
              question: langSettings.LOGOUT_POPUP_QUESTION,
              confirm: langSettings.LOGOUT_POPUP_CONFIRM,
              cancel: langSettings.LOGOUT_POPUP_CANCEL,
            },
          });
        }}
        className="gap-4 hover:bg-slate-200 md:rounded-b-lg"
      >
        <IconDoorExit strokeWidth="1" className="text-red-600 ml-1" size={32} />
        <Text
          size="xl"
          font="light"
          uppercase
          letterSpacing
          className="select-none text-red-600"
        >
          {langSettings.ITEM_LOGOUT}
        </Text>
      </Button>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full md:w-full h-full md:h-fit self-center flex items-center justify-center border-t-2 border-slate-100 md:border-0">
      <Paper className="h-full w-full md:w-72 md:p-4 flex flex-col justify-center md:rounded-xl shadow-md bg-slate-50">
        {children}
      </Paper>
    </div>
  );
}
