import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo } from "react";
import { checkRoomId } from "../../../shared/lib/uuid";
import { routes } from "../../../constants";
import { useQueryRooms } from "../../../shared/api/api";
import { store } from "../../../shared/store/store";
import { useInterval } from "../../../shared/lib/useInterval";
import { debounce } from "../../../shared/lib/debounce";
import {
  DEBOUNCE_SCROLL_DELAY,
  ITEM_COUNT_FOR_INITIAL_LOADING,
  ITEM_HEIGHT,
  OVERSCREEN_ITEM_COUNT_FOR_FURTHER_LOADING,
  OVERSCREEN_ITEM_COUNT_TO_TRIGGER_FURTHER_LOADING,
  RELOAD_INTERVAL,
} from "./constants";

export function useLoadRooms() {
  const query = useQueryRooms();
  const storeAction = store().rooms();
  const storedData = store().rooms().read();
  const storedRooms = storedData?.items;

  const run = useCallback(
    async (max?: number) => {
      if (!max) {
        if (storedRooms && storedRooms?.length !== 0) {
          max = storedRooms?.length;
        } else {
          max = ITEM_COUNT_FOR_INITIAL_LOADING;
        }
      }

      const { success, data } = await query.run({ min: 0 as const, max });
      if (success && data) {
        storeAction.update(data);
      }
      if (!success) console.error("Rooms no success");
    },
    [query, storeAction, storedRooms],
  );

  return { run };
}

function usePartiallyLoadRooms() {
  const query = useQueryRooms();
  const storedData = store().rooms().read();
  const storedRooms = storedData?.items;
  const storeAction = store().rooms();

  const loadRooms = useLoadRooms();

  const run = useCallback(
    async (min: number, max: number) => {
      const { success, data } = await query.run({
        min,
        max,
      });
      if (success && storedRooms && data.items) {
        if (storedData.allCount === data.allCount) {
          for (let i = 0; i < storedData.allCount; i++) {
            if (
              storedRooms[i + min] &&
              storedRooms[i + min].roomId !== data.items[i].roomId
            ) {
              await loadRooms.run(max);
              return;
            }
          }
          storeAction.update({
            success: data.success,
            allCount: data.allCount,
            items: (storedRooms || []).concat(data.items || []),
          });
        }
        if (storedData.allCount !== data.allCount) await loadRooms.run(max);
      }
      if (!success) console.error("Rooms no success");
    },
    [query, loadRooms, storeAction, storedData, storedRooms],
  );

  return { run };
}

export function useRooms() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const storedData = store().rooms().read();
  const storedRooms = storedData?.items;

  const isZeroItemCount = storedData?.allCount === 0;
  const isAllLoaded = !!(
    storedData && storedData.allCount === storedRooms?.length
  );

  const loadRooms = useLoadRooms();
  const partialLoadRooms = usePartiallyLoadRooms();

  // Reload rooms
  useInterval(() => {
    if (storedRooms) loadRooms.run(storedRooms.length);
  }, RELOAD_INTERVAL);

  useEffect(() => {
    // wrong roomId protection
    if (roomId && !checkRoomId(roomId)) navigate(routes.rooms.path);
    // Initial load
    loadRooms.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = useCallback(
    async (e: React.UIEvent<HTMLElement>) => {
      if (!isAllLoaded && !isZeroItemCount && storedRooms) {
        const target = e.nativeEvent.target as HTMLElement;
        const lastVisibleIndex = Math.ceil(
          (target.scrollTop + target.offsetHeight) / ITEM_HEIGHT,
        );
        const lastLoadedIndex = storedRooms.length;
        const isNeedToLoad = !!(
          lastLoadedIndex - lastVisibleIndex <
          OVERSCREEN_ITEM_COUNT_TO_TRIGGER_FURTHER_LOADING
        );
        if (isNeedToLoad) {
          if (
            lastLoadedIndex + OVERSCREEN_ITEM_COUNT_FOR_FURTHER_LOADING >
            storedData.allCount
          ) {
            await partialLoadRooms.run(lastLoadedIndex, storedData.allCount);
          }
          if (lastVisibleIndex > lastLoadedIndex) {
            const stopItem =
              lastVisibleIndex + OVERSCREEN_ITEM_COUNT_FOR_FURTHER_LOADING;
            stopItem > storedData.allCount
              ? await partialLoadRooms.run(lastLoadedIndex, storedData.allCount)
              : await partialLoadRooms.run(lastLoadedIndex, stopItem);
          } else {
            const stopItem =
              lastLoadedIndex + OVERSCREEN_ITEM_COUNT_FOR_FURTHER_LOADING;
            await partialLoadRooms.run(lastLoadedIndex, stopItem);
          }
        }
      }
    },
    [storedData, partialLoadRooms, isAllLoaded, isZeroItemCount, storedRooms],
  );

  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, DEBOUNCE_SCROLL_DELAY),
    [handleScroll],
  );

  return {
    isZeroItemCount,
    isAllLoaded,
    storedData,
    roomId,
    debouncedHandleScroll,
  };
}
