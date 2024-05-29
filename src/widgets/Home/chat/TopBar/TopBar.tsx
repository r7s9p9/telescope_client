import { useInfo } from "../useChat";
import { Text } from "../../../../shared/ui/Text/Text";
import {
  IconDoorExit,
  IconDotsVertical,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Button } from "../../../../shared/ui/Button/Button";
import { useTopBar } from "./useTopBar";

export function TopBar({ data }: { data: ReturnType<typeof useInfo> }) {
  const { content, menu } = useTopBar(data);

  return (
    <div className="w-full h-16 px-4 font-light flex justify-between items-center border-x-2 border-slate-100 bg-slate-50 select-none">
      {!content.isInitialLoading && (
        <div className="flex items-center shrink-0">
          <div className="size-10 flex items-center justify-center text-2xl uppercase font-light rounded-full border-2 border-slate-400">
            {content.name?.at(0)}
          </div>
          <div className="flex flex-col ml-4 py-2 grow">
            <Text size="md" font="light">
              {content.name}
            </Text>
            <div className="flex flex-row gap-1">
              <Text size="sm" font="light">
                {content.description}
              </Text>
            </div>
          </div>
        </div>
      )}
      {content.isInitialLoading && <TopBarSkeleton />}
      <TopBarMenu menu={menu} isMember={content.isMember} />
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
  menu,
  isMember,
}: {
  menu: ReturnType<typeof useTopBar>["menu"];
  isMember?: boolean;
}) {
  return (
    <>
      <Button
        title={"Show more"}
        rounded={"full"}
        buttonRef={menu.buttonRef}
        onClick={menu.open}
      >
        <IconDotsVertical
          className="text-slate-600"
          strokeWidth="1"
          size={32}
        />
      </Button>
      <div
        style={{
          opacity: menu.isOpened ? 1 : 0,
          transform: menu.isOpened
            ? "translateY(0%) scaleY(1)"
            : "translateY(-50%) scaleY(0)",
        }}
        ref={menu.contentRef}
        className="absolute z-10 flex flex-col right-0 top-16 duration-300 ease-in-out border-t-2 border-slate-100 bg-slate-50 shadow-md rounded-b-lg"
      >
        <Button title={"Info"} onClick={() => menu.onClickHandler("info")}>
          <div className="w-28 h-8 flex items-center">
            <IconInfoCircle
              className="w-12 text-slate-600"
              strokeWidth="2"
              size={18}
            />
            <Text size="md" font="default" className="text-slate-600">
              Info
            </Text>
          </div>
        </Button>
        {isMember && (
          <Button title={"Leave"} onClick={() => menu.onClickHandler("leave")}>
            <div className="w-28 h-8 flex items-center">
              <IconDoorExit
                className="w-12 text-red-600"
                strokeWidth="2"
                size={18}
              />
              <Text size="md" font="default" className="text-red-600">
                Leave
              </Text>
            </div>
          </Button>
        )}
      </div>
    </>
  );
}
