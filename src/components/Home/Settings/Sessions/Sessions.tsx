import { ReactNode } from "react";
import { Paper } from "../../../../shared/ui/Paper/Paper";
import { Text } from "../../../../shared/ui/Text/Text";
import { useSessions } from "./useSessions";
import { parseUserAgent } from "../../../../shared/lib/userAgent";
import {
  IconBrandChrome,
  IconBrandEdge,
  IconBrandFirefox,
  IconBrowser,
  IconCircleArrowLeft,
  IconDeviceDesktop,
  IconDeviceGamepad,
  IconDeviceMobile,
  IconDeviceTv,
  IconDeviceWatch,
  IconTrash,
} from "@tabler/icons-react";
import { formatDate } from "../../../../shared/lib/date";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import { useConfirmPopup } from "../../../../shared/features/ConfirmPopup/ConfirmPopup";
import { Button } from "../../../../shared/ui/Button/Button";
import { useLang } from "../../../../shared/features/LangProvider/LangProvider";

export function Sessions() {
  const {
    currentSession,
    otherSessions,
    isLoaded,
    remove,
    isFromAnotherPage,
    returnBack,
    lang,
  } = useSessions();

  if (!isLoaded) {
    return (
      <Wrapper
        isFromAnotherPage={isFromAnotherPage}
        returnBack={returnBack}
        lang={lang}
      >
        <div className="h-1/2 p-4 rounded-xl animate-pulse bg-slate-200" />
      </Wrapper>
    );
  }

  if (!currentSession) {
    return (
      <Wrapper
        isFromAnotherPage={isFromAnotherPage}
        returnBack={returnBack}
        lang={lang}
      >
        <Text size="md" font="light" className="text-center">
          {lang.sessions.NO_CURRENT_SESSION}
        </Text>
      </Wrapper>
    );
  }

  if (!otherSessions) {
    return (
      <Wrapper
        isFromAnotherPage={isFromAnotherPage}
        returnBack={returnBack}
        lang={lang}
      >
        <Session data={currentSession} remove={remove} lang={lang} />
      </Wrapper>
    );
  }

  const items = otherSessions.map((data) => (
    <Session data={data} remove={remove} key={data.sessionId} lang={lang} />
  ));

  return (
    <Wrapper
      isFromAnotherPage={isFromAnotherPage}
      returnBack={returnBack}
      lang={lang}
    >
      <Session
        data={currentSession}
        remove={remove}
        key={currentSession.sessionId}
        lang={lang}
      />
      {items}
    </Wrapper>
  );
}

function Session({
  data,
  remove,
  lang,
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
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const parsedUserAgent = parseUserAgent(data.userAgent);
  const lastSeen = formatDate().session(data.lastSeen);
  const isOnline = lastSeen.range === "seconds";

  const confirmPopup = useConfirmPopup();

  return (
    <div className="relative rounded-r-xl rounded-l-[50px] shrink-0 h-22 mb-4 hover:bg-slate-200 duration-300 ease-in-out flex">
      <DeviceIcon parsedUserAgent={parsedUserAgent} />
      <div className="pl-4 flex flex-col md:flex-row md:grow">
        <div className="md:grow flex flex-col md:justify-between">
          <Text size="sm" font="light" capitalize>
            {lang.sessions.DEVICE_ITEM}: {parsedUserAgent.device}
          </Text>
          <Text size="sm" font="light" capitalize>
            {lang.sessions.BROWSER_ITEM}: {parsedUserAgent.browser}
          </Text>
          <Text size="sm" font="light">
            IP: {data.ip}
          </Text>
          {!data.isCurrent && !isOnline && (
            <Text size="sm" font="light">
              {lang.sessions.LAST_SEEN_TEXT(lastSeen.result as string)}
            </Text>
          )}
        </div>
        <div className="pr-2 flex flex-col grow md:items-end justify-end md:justify-between">
          {data.isCurrent && (
            <Text size="sm" font="light" className="text-green-600">
              {lang.sessions.STATUS_THIS_DEVICE}
            </Text>
          )}
          {data.isFrozen && (
            <Text size="sm" font="light" className="text-red-600">
              {lang.sessions.STATUS_BLOCKED}
            </Text>
          )}
          {!data.isCurrent && isOnline && (
            <Text size="sm" font="light" className="text-green-600">
              {lang.sessions.STATUS_ONLINE}
            </Text>
          )}
        </div>
        {!data.isCurrent && (
          <IconButton
            title={lang.sessions.BUTTON_DELETE_LABEL}
            className="hover:bg-slate-400 absolute bottom-1 right-1"
            onClick={() =>
              confirmPopup.show({
                onAgree: () => remove(data.sessionId),
                onClose: confirmPopup.hide,
                text: {
                  title: lang.sessions.DELETE_POPUP_TITLE,
                  question: lang.sessions.DELETE_POPUP_QUESTION,
                  confirm: lang.sessions.DELETE_POPUP_CONFIRM,
                  cancel: lang.sessions.DELETE_POPUP_CANCEL,
                },
              })
            }
          >
            <IconTrash size={28} strokeWidth="1.5" className="text-slate-600" />
          </IconButton>
        )}
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
      <div className="absolute left-0 top-0 rounded-full p-0.5 border-2 border-slate-300 bg-slate-50">
        {deviceIcon}
      </div>
      <div className="pt-14 p-0.5 md:p-0.5 md:pl-14 overflow-hidden rounded-full border-2 border-slate-300 bg-slate-50">
        {browserIcon}
      </div>
    </div>
  );
}

function Wrapper({
  children,
  isFromAnotherPage,
  returnBack,
  lang,
}: {
  children: ReactNode;
  isFromAnotherPage: boolean;
  returnBack: ReturnType<typeof useSessions>["returnBack"];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  return (
    <div className="w-full h-full flex items-center justify-center border-t-2 border-slate-100 md:border-0">
      <Paper
        padding={4}
        className="w-full h-full md:w-3/4 md:h-[400px] md:min-w-[350px] md:max-w-[650px] md:rounded-xl flex flex-col shadow-md bg-slate-50"
      >
        <Text size="xl" font="light" className="select-none mb-4">
          {lang.sessions.TITLE}
        </Text>
        <div className="h-full overflow-y-auto">{children}</div>
        {isFromAnotherPage && (
          <Button
            title={lang.sessions.BUTTON_GO_BACK_LABEL}
            size="md"
            onClick={returnBack}
            disabled={!isFromAnotherPage}
            className="w-36 justify-center mt-4 shrink-0"
          >
            <IconCircleArrowLeft
              className="text-slate-600"
              strokeWidth="1"
              size={24}
            />
            <Text size="md" font="light">
              {lang.sessions.BUTTON_GO_BACK_LABEL}
            </Text>
          </Button>
        )}
      </Paper>
    </div>
  );
}
