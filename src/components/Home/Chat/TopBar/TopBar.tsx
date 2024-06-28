import { useInfo } from "../useChat";
import { Text } from "../../../../shared/ui/Text/Text";
import {
  IconCircleArrowLeft,
  IconLayoutSidebarRightExpand,
} from "@tabler/icons-react";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import { useTopBar } from "./useTopBar";

export function TopBar({ data }: { data: ReturnType<typeof useInfo> }) {
  const { content, openSideBar, closeSideBar, closeChat, isSideBarExpanded } =
    useTopBar(data);

  const iconProps = {
    className: "text-slate-600",
    strokeWidth: "1",
    size: 32,
  };

  return (
    <div className="relative shrink-0 w-full min-w-[320px] h-14 md:h-16 px-4 flex items-center md:border-x-2 border-slate-100 bg-slate-50 select-none">
      <IconCircleArrowLeft
        onClick={closeChat}
        strokeWidth="1"
        size={32}
        className="shrink-0 text-slate-600 md:invisible md:hidden mr-4"
      />
      {!content.isInitialLoading && (
        <>
          <div className="flex items-center gap-4">
            <Text
              size="xl"
              font="light"
              uppercase
              className="size-10 hidden md:flex justify-center items-center rounded-full border-2 border-gray-400 "
            >
              {content.name?.at(0)}
            </Text>
            <div className="max-w-48 flex flex-col">
              <Text size="sm" font="light" className="truncate">
                {content.name}
              </Text>
              <Text size="sm" font="light">
                {content.description}
              </Text>
            </div>
          </div>
          <div className="grow" />
        </>
      )}
      {content.isInitialLoading && <TopBarSkeleton />}
      <IconButton
        title={"Show more"}
        onClick={isSideBarExpanded ? closeSideBar : openSideBar}
        style={{ transform: isSideBarExpanded ? "rotate(180deg)" : "" }}
        className="shrink-0"
      >
        <IconLayoutSidebarRightExpand {...iconProps} />
      </IconButton>
    </div>
  );
}

function TopBarSkeleton() {
  return (
    <div className="h-16 w-full flex items-center animate-pulse">
      <div className="size-10 shrink-0 bg-slate-200 rounded-full"></div>
      <div className="ml-4 h-full w-full flex flex-col justify-center gap-2">
        <div className="w-36 h-4 rounded-md bg-slate-200" />
        <div className="w-24 h-4 rounded-md bg-slate-200" />
      </div>
    </div>
  );
}
