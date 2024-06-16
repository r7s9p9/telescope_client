import { ReactNode } from "react";
import { Paper } from "../../../../shared/ui/Paper/Paper";
import { Text } from "../../../../shared/ui/Text/Text";
import { useSessions } from "./useSessions";
import { parseUserAgent } from "../../../../shared/lib/userAgent";
import {
  IconBrandChrome,
  IconBrandEdge,
  IconBrandFirefox,
  IconDeviceDesktop,
  IconDeviceGamepad,
  IconDeviceMobile,
  IconDeviceTv,
  IconDeviceWatch,
  IconLock,
  IconTrash,
} from "@tabler/icons-react";
import { formatDate } from "../../../../shared/lib/date";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import { usePopup } from "../../../Popup/Popup";
import { ConfirmPopup } from "../../../../shared/ui/ConfirmPopup/ConfirmPopup";

export function Sessions() {
  const { currentSession, otherSessions, isLoaded } = useSessions();

  if (!isLoaded) {
    return <Loader />;
  }

  if (!currentSession) {
    return <ServiceUnavailable />;
  }

  if (!otherSessions) {
    return (
      <Wrapper>
        <Session data={currentSession} />
      </Wrapper>
    );
  }

  const items = otherSessions.map((data) => (
    <Session data={data} key={data.sessionId} />
  ));

  return (
    <Wrapper>
      <Session data={currentSession} key={currentSession.sessionId} />
      {items}
    </Wrapper>
  );
}

function Session({
  data,
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
}) {
  const parsedUserAgent = parseUserAgent(data.userAgent);
  const lastSeen = formatDate().session(data.lastSeen);
  const isOnline = lastSeen.range === "seconds";

  const popup = usePopup();

  return (
    <div className="relative rounded-l-full shrink-0 h-fit mb-4 hover:bg-slate-200 duration-300 ease-in-out flex justify-between">
      <DeviceIcon parsedUserAgent={parsedUserAgent} />
      <div className="pl-4 grow flex flex-col justify-between">
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
      <div className="self-end pr-1">
        {data.isCurrent && (
          <Text size="sm" font="light" className="text-green-600">
            This device
          </Text>
        )}
        {data.isFrozen && (
          <Text size="sm" font="light" className="text-red-600">
            Blocked
          </Text>
        )}
        {!data.isCurrent && (
          <Text
            size="sm"
            font="light"
            className={`${isOnline ? "text-green-600" : "text-slate-600"}`}
          >
            {isOnline ? "Online" : `Last seen: ${lastSeen.result}`}
          </Text>
        )}
      </div>
      <div className="absolute right-1 top-1 flex gap-2">
        <IconButton
          title="Block session"
          className="hover:bg-slate-300"
          onClick={() =>
            popup.show(
              ConfirmPopup({
                onAgree: () => {},
                onClose: popup.hide,
                text: "Are you sure you want to lock this session?",
              }),
            )
          }
        >
          <IconLock size={28} strokeWidth="1.5" className="text-slate-600" />
        </IconButton>
        <IconButton
          title="Close session"
          className="hover:bg-slate-300"
          onClick={() =>
            popup.show(
              ConfirmPopup({
                onAgree: () => {},
                onClose: popup.hide,
                text: "Are you sure you want to delete this session?",
              }),
            )
          }
        >
          <IconTrash size={28} strokeWidth="1.5" className="text-slate-600" />
        </IconButton>
      </div>
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
    strokeWidth: "1",
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
  }

  return (
    <div className="flex relative">
      <div className="absolute left-0 top-0 rounded-full w-fit h-fit p-1 border-4 border-slate-400 bg-slate-100">
        {deviceIcon}
      </div>
      <div className="pl-14 overflow-hidden rounded-full w-fit h-fit p-1 border-4 border-slate-400 bg-slate-100">
        {browserIcon}
      </div>
    </div>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
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
      </Paper>
    </div>
  );
}

function Loader() {
  return (
    <Wrapper>
      <div className="h-full p-4 rounded-xl animate-pulse bg-slate-200" />
    </Wrapper>
  );
}

function ServiceUnavailable() {
  return (
    <Wrapper>
      <Text size="md" font="light">
        Sorry, but this functionality is currently unavailable. Please try again
        later.
      </Text>
    </Wrapper>
  );
}
