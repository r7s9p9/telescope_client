import { ReactNode } from "react";
import { Paper } from "../../../../shared/ui/Paper/Paper";
import { Text } from "../../../../shared/ui/Text/Text";
import { useSessions } from "./useSessions";
import { parseUserAgent } from "../../../../shared/lib/userAgent";
import {
  IconArrowBackUp,
  IconBrandChrome,
  IconBrandEdge,
  IconBrandFirefox,
  IconBrowser,
  IconDeviceDesktop,
  IconDeviceGamepad,
  IconDeviceMobile,
  IconDeviceTv,
  IconDeviceWatch,
  IconTrash,
} from "@tabler/icons-react";
import { formatDate } from "../../../../shared/lib/date";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import { usePopup } from "../../../Popup/Popup";
import { ConfirmPopup } from "../../../../shared/ui/ConfirmPopup/ConfirmPopup";
import { Button } from "../../../../shared/ui/Button/Button";

export function Sessions() {
  const {
    currentSession,
    otherSessions,
    isLoaded,
    remove,
    isFromAnotherPage,
    returnBack,
  } = useSessions();

  if (!isLoaded) {
    return (
      <Wrapper isFromAnotherPage={isFromAnotherPage} returnBack={returnBack}>
        <div className="h-full p-4 rounded-xl animate-pulse bg-slate-200" />
      </Wrapper>
    );
  }

  if (!currentSession) {
    return (
      <Wrapper isFromAnotherPage={isFromAnotherPage} returnBack={returnBack}>
        <Text size="md" font="light" className="text-center">
          Sorry, but this functionality is currently unavailable. Please try
          again later.
        </Text>
      </Wrapper>
    );
  }

  if (!otherSessions) {
    return (
      <Wrapper isFromAnotherPage={isFromAnotherPage} returnBack={returnBack}>
        <Session data={currentSession} remove={remove} />
      </Wrapper>
    );
  }

  const items = otherSessions.map((data) => (
    <Session data={data} remove={remove} key={data.sessionId} />
  ));

  return (
    <Wrapper isFromAnotherPage={isFromAnotherPage} returnBack={returnBack}>
      <Session
        data={currentSession}
        remove={remove}
        key={currentSession.sessionId}
      />
      {items}
    </Wrapper>
  );
}

function Session({
  data,
  remove,
}: {
  data: {
    userAgent: string;
    ip: string;
    lastSeen: number;
    isFrozen: boolean;
    sessionId: string;
    isCurrent: boolean;
    deviceName?: string;
  };
  remove: ReturnType<typeof useSessions>["remove"];
}) {
  const parsedUserAgent = parseUserAgent(data.userAgent);
  const lastSeen = formatDate().session(data.lastSeen);
  const isOnline = lastSeen.range === "seconds";

  const popup = usePopup();

  return (
    <div className="relative rounded-r-2xl rounded-l-[100px] shrink-0 h-22 mb-4 hover:bg-slate-300 duration-300 ease-in-out flex justify-between">
      <DeviceIcon parsedUserAgent={parsedUserAgent} />
      <div className="pl-4 py-2 grow flex flex-col justify-between">
        <Text size="sm" font="light" capitalize>
          Device: {parsedUserAgent.device}
        </Text>
        <Text size="sm" font="light" capitalize>
          Browser: {parsedUserAgent.browser}
        </Text>
        <Text size="sm" font="light">
          IP: {data.ip}
        </Text>
      </div>
      <div className="pr-2 py-2 flex flex-col justify-between">
        {data.isCurrent && (
          <Text size="sm" font="light">
            This device
          </Text>
        )}
        {data.isFrozen && (
          <Text size="sm" font="light" className="text-red-600">
            Blocked
          </Text>
        )}
        {!data.isCurrent && (
          <Text size="sm" font="light">
            {isOnline ? "Online" : `Last seen: ${lastSeen.result}`}
          </Text>
        )}
      </div>
      {!data.isCurrent && (
        <IconButton
          title="Delete session"
          className="hover:bg-slate-400 absolute bottom-1 right-1"
          onClick={() =>
            popup.show(
              ConfirmPopup({
                onAgree: () => remove(data.sessionId),
                onClose: popup.hide,
                text: "Are you sure you want to delete this session?",
              }),
            )
          }
        >
          <IconTrash size={28} strokeWidth="1.5" className="text-slate-600" />
        </IconButton>
      )}
    </div>
  );
}

function DeviceIcon({
  parsedUserAgent,
}: {
  parsedUserAgent: ReturnType<typeof parseUserAgent>;
}) {
  let deviceIcon = <></>;
  let browserIcon = <></>;

  const iconProps = {
    size: 72,
    strokeWidth: "0.75",
    className: "text-slate-600",
  };

  switch (parsedUserAgent.device) {
    case "console":
      deviceIcon = <IconDeviceGamepad {...iconProps} />;
      break;
    case "smarttv":
      deviceIcon = <IconDeviceTv {...iconProps} />;
      break;
    case "wearable":
      deviceIcon = <IconDeviceWatch {...iconProps} />;
      break;
    case "mobile":
    case "tablet":
      deviceIcon = <IconDeviceMobile {...iconProps} />;
      break;
    default:
      deviceIcon = <IconDeviceDesktop {...iconProps} />;
  }

  switch (parsedUserAgent.browser) {
    case "Chrome":
    case "Chromium":
      browserIcon = <IconBrandChrome {...iconProps} />;
      break;
    case "Firefox":
      browserIcon = <IconBrandFirefox {...iconProps} />;
      break;
    case "Edge":
      browserIcon = <IconBrandEdge {...iconProps} />;
      break;
    default:
      browserIcon = <IconBrowser {...iconProps} />;
  }

  return (
    <div className="flex relative">
      <div className="absolute left-0 top-0 rounded-full w-fit h-fit p-1 border-2 border-slate-400 bg-slate-100">
        {deviceIcon}
      </div>
      <div className="pl-14 overflow-hidden rounded-full w-fit h-fit p-1 border-2 border-slate-400 bg-slate-100">
        {browserIcon}
      </div>
    </div>
  );
}

function Wrapper({
  children,
  isFromAnotherPage,
  returnBack,
}: {
  children: ReactNode;
  isFromAnotherPage: boolean;
  returnBack: ReturnType<typeof useSessions>["returnBack"];
}) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="w-3/4 h-[400px] min-w-[350px] max-w-[650px] flex flex-col"
      >
        <Text size="xl" font="light" className="select-none mb-4">
          Sessions
        </Text>
        <div className="h-full overflow-scroll">{children}</div>
        {isFromAnotherPage && (
          <Button
            title="Go back"
            size="md"
            onClick={returnBack}
            disabled={!isFromAnotherPage}
            className="w-32 justify-center mt-4 shrink-0"
          >
            <>
              <IconArrowBackUp
                className="text-slate-500"
                strokeWidth="1.5"
                size={24}
              />
              <Text size="md" font="light">
                Go back
              </Text>
            </>
          </Button>
        )}
      </Paper>
    </div>
  );
}
