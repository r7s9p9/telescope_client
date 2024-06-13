import { useInfo } from "../useChat";
import { Text } from "../../../../shared/ui/Text/Text";
import { IconLayoutSidebarRightExpand } from "@tabler/icons-react";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import { useTopBar } from "./useTopBar";

export function TopBar({ data }: { data: ReturnType<typeof useInfo> }) {
  const { content, openSideBar, closeSideBar, isSideBarExpanded } =
    useTopBar(data);

  return (
    <div className="w-full h-16 px-4 font-light flex justify-between items-center border-l-2 border-slate-100 bg-slate-50 select-none">
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
      <IconButton
        title={"Show more"}
        onClick={isSideBarExpanded ? closeSideBar : openSideBar}
        style={{ transform: isSideBarExpanded ? "rotate(180deg)" : "" }}
      >
        <IconLayoutSidebarRightExpand
          className="text-slate-600"
          strokeWidth="1"
          size={32}
        />
      </IconButton>
    </div>
  );
}

function TopBarSkeleton() {
  return (
    <div className="h-16 flex items-center animate-pulse">
      <div className="size-10 bg-slate-200 rounded-full"></div>
      <div className="ml-4 h-full flex flex-col justify-center gap-2">
        <div className="w-64 h-6 rounded-md bg-slate-200" />
        <div className="w-36 h-4 rounded-md bg-slate-200" />
      </div>
    </div>
  );
}
