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
import { useConfirmPopup } from "../../ConfirmPopup/ConfirmPopup";
import { useNotify } from "../../Notification/Notification";

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
      <Paper
        shadow="xl"
        className="h-full w-full md:w-72 md:p-4 flex flex-col justify-center md:rounded-xl bg-slate-50"
      >
        <Button
          title="My Profile"
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
            My profile
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
            Privacy
          </Text>
        </Button>
        <Button
          title="Sessions"
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
            Sessions
          </Text>
        </Button>
        <Button
          title="Language"
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
            Language
          </Text>
        </Button>
        <Button
          title="Logout"
          size="xl"
          unstyled
          onClick={() => {
            confirmPopup.show({
              onAgree: onClickHandler().logout,
              onClose: confirmPopup.hide,
              text: {
                question: "Are you sure you want to log out?",
                confirm: "Logout",
                cancel: "Cancel",
              },
            });
          }}
          className="gap-4 hover:bg-slate-200 md:rounded-b-lg"
        >
          <IconDoorExit
            strokeWidth="1"
            className="text-red-600 ml-1"
            size={32}
          />
          <Text
            size="xl"
            font="light"
            uppercase
            letterSpacing
            className="select-none text-red-600"
          >
            Logout
          </Text>
        </Button>
      </Paper>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full md:w-full h-full md:h-fit self-center flex items-center justify-center border-t-2 border-slate-100 md:border-0">
      {children}
    </div>
  );
}
