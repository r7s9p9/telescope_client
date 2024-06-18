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
import { usePopup } from "../../Popup/Popup";
import { ConfirmPopup } from "../../../shared/ui/ConfirmPopup/ConfirmPopup";
import { WIP } from "../../WIP/WIP";

export function Settings() {
  const { onClickHandler } = useSettings();
  const popup = usePopup();

  return (
    <Wrapper>
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="h-full flex flex-col bg-slate-50"
      >
        <Button
          title="My Profile"
          size="xl"
          unstyled
          padding={96}
          onClick={onClickHandler().profile}
          className="gap-4 hover:bg-slate-200 rounded-t-lg"
        >
          <IconUser strokeWidth="1.5" className="text-slate-600" size={28} />
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
          padding={96}
          onClick={onClickHandler().privacy}
          className="gap-4 hover:bg-slate-200"
        >
          <IconLock strokeWidth="1.5" className="text-slate-600" size={28} />
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
          padding={96}
          onClick={onClickHandler().sessions}
          className="gap-4 hover:bg-slate-200"
        >
          <IconDeviceDesktop
            strokeWidth="1.5"
            className="text-slate-600"
            size={28}
          />
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
          padding={96}
          onClick={() => {
            popup.show(<WIP />);
          }}
          className="gap-4 hover:bg-slate-200"
        >
          <IconLanguage
            strokeWidth="1.5"
            className="text-slate-600"
            size={28}
          />
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
          padding={96}
          onClick={() => {
            popup.show(
              ConfirmPopup({
                onAgree: onClickHandler().logout,
                onClose: popup.hide,
                text: "Are you sure you want to log out?",
              }),
            );
          }}
          className="gap-4 hover:bg-slate-200 rounded-b-lg"
        >
          <IconDoorExit strokeWidth="1.5" className="text-red-600" size={28} />
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
    <div className="w-full self-center flex items-center justify-center">
      {children}
    </div>
  );
}
