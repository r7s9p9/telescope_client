import { useInfo, useLoadInfo } from "../useChat";
import { routes } from "../../../../constants";
import { useNavigate } from "react-router-dom";
import { useQueryLeaveRoom } from "../../../../shared/api/api";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Text } from "../../../../shared/ui/text/text";
import {
  IconDoorExit,
  IconDotsVertical,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Button } from "../../../../shared/ui/Button/Button";
import { RoomId } from "../../../../types";
import { useLoadRooms } from "../../rooms/useRooms";

export function TopBar({ data }: { data: ReturnType<typeof useInfo> }) {
  const userCountStr = () => {
    if (data.info.userCount === 0) {
      return "no members";
    }
    if (data.info.userCount === 1) {
      return "1 member";
    }
    if (data.info.userCount && data.info.userCount > 1) {
      return `${data.info.userCount} members`;
    }
  };

  return (
    <div className="shrink-0 w-full h-16 px-4 font-light flex justify-between items-center border-x-2 border-slate-100 bg-slate-50 select-none">
      {!data.info.isInitialLoading && (
        <>
          <div className="size-10 flex items-center justify-center text-2xl uppercase font-light rounded-full border-2 border-slate-400">
            {data.info?.name?.at(0)}
          </div>
          <div className="flex flex-col ml-4 grow">
            <Text size="md" font="light">
              {data.info.name}
            </Text>
            <div className="flex flex-row gap-1">
              <Text size="sm" font="light">
                {data.info?.type} room, {userCountStr()}
              </Text>
            </div>
          </div>
        </>
      )}
      {data.info.isInitialLoading && <TopBarSkeleton />}
      <TopBarMenu roomId={data.roomId} isMember={data.info.isMember} />
    </div>
  );
}

function TopBarSkeleton() {
  return (
    <div className="h-14 flex items-center animate-pulse">
      <div className="size-10 bg-slate-200 rounded-full"></div>
      <div className="ml-4 h-full flex flex-col justify-center gap-2">
        <div className="w-64 h-6 rounded-md bg-slate-200" />
        <div className="w-36 h-4 rounded-md bg-slate-200" />
      </div>
    </div>
  );
}

function TopBarMenu({
  roomId,
  isMember,
}: {
  roomId: RoomId;
  isMember?: boolean;
}) {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = () => {
    setIsMenuOpened((isMenuOpened) => (isMenuOpened ? false : isMenuOpened));
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        contentRef.current &&
        buttonRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    },
    [contentRef, buttonRef],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryLeave = useQueryLeaveRoom();
  const navigate = useNavigate();

  const loadInfo = useLoadInfo();
  const loadRooms = useLoadRooms();

  async function onClickHandler(type: "info" | "leave") {
    if (roomId) {
      if (type === "info") {
        navigate({ pathname: routes.rooms.path + roomId + "/info" });
      }
      if (type === "leave") {
        const { success } = await queryLeave.run(roomId);
        if (success) {
          loadRooms.run();
          loadInfo.run();
          navigate({ pathname: routes.rooms.path });
        }
      }
    }
  }

  function ContentWrapper({
    icon,
    text,
    type,
  }: {
    icon: ReactNode;
    text: string;
    type?: "default" | "warning";
  }) {
    return (
      <div className="w-28 h-8 flex items-center">
        <div className="w-12 flex justify-center">{icon}</div>
        <p
          className={`${type === "warning" ? "text-red-900" : "text-slate-900"}`}
        >
          {text}
        </p>
      </div>
    );
  }

  return (
    <>
      <Button
        title={"Show more"}
        rounded={"full"}
        buttonRef={buttonRef}
        onClick={() => setIsMenuOpened(!isMenuOpened)}
      >
        <IconDotsVertical
          className="text-slate-600"
          strokeWidth="1"
          size={32}
        />
      </Button>

      <div
        style={{
          opacity: isMenuOpened ? 1 : 0,
          transform: isMenuOpened
            ? "translateY(0%) scaleY(1)"
            : "translateY(-50%) scaleY(0)",
        }}
        ref={contentRef}
        className="absolute z-10 flex flex-col right-0 top-16 duration-300 ease-in-out border-t-2 border-slate-100 bg-slate-50 shadow-md font-normal"
      >
        <Button title={"Info"} onClick={() => onClickHandler("info")}>
          <ContentWrapper
            icon={
              <IconInfoCircle
                className="text-slate-600"
                strokeWidth="2"
                size={18}
              />
            }
            text="Info"
            type="default"
          />
        </Button>
        {isMember && (
          <Button title={"Leave"} onClick={() => onClickHandler("leave")}>
            <ContentWrapper
              icon={
                <IconDoorExit
                  className="text-red-600"
                  strokeWidth="2"
                  size={18}
                />
              }
              text="Leave"
              type="warning"
            />
          </Button>
        )}
      </div>
    </>
  );
}
