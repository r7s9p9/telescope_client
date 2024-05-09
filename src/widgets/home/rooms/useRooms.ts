import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo } from "react";
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

// Load for the first time and refresh
export function useLoadRooms() {
  const query = useQueryRooms();
  const storeAction = store().rooms();
  const storedRooms = storeAction.read().items;

  const run = useCallback(async () => {
    let max: number;
    if (!storedRooms || storedRooms.length === 0) {
      max = ITEM_COUNT_FOR_INITIAL_LOADING;
    } else {
      max = storedRooms.length;
    }
    const { success, data } = await query.run({ min: 0 as const, max });
    if (success && data) {
      storeAction.update(data);
    }
    if (!success) console.error("Rooms no success");
  }, [query, storedRooms, storeAction]);

  return { run };
}

// On scroll
export function useLoadMoreRooms() {
  const query = useQueryRooms();
  const storeAction = store().rooms();
  const storedData = storeAction.read();

  const run = useCallback(
    async (min: number, max: number) => {
      const { success, data } = await query.run({ min, max });
      if (success && data.success && data.items) {
        const newRooms = data.items.filter(
          (loaded) =>
            !storedData.items?.some(
              (stored) => stored.roomId === loaded.roomId,
            ),
        );
        storeAction.update({
          items: (storedData?.items || []).concat(newRooms),
          allCount: data.allCount,
        });
      } else {
        console.error("Rooms loading failed");
      }
    },
    [query, storeAction, storedData],
  );

  return { run };
}

export function useRooms() {
  const { roomId } = useParams();

  const storedData = store().rooms().read();
  const storedRooms = storedData?.items;

  const isZeroItemCount = storedData?.allCount === 0;
  const isAllLoaded = !!(
    storedData && storedData.allCount === storedRooms?.length
  );

  const loadRooms = useLoadRooms();
  const loadMoreRooms = useLoadMoreRooms();

  // Reload rooms
  useInterval(() => {
    if (storedRooms) loadRooms.run();
  }, RELOAD_INTERVAL);

  // Initial load
  useEffect(() => {
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
            await loadMoreRooms.run(lastLoadedIndex, storedData.allCount);
          }
          if (lastVisibleIndex > lastLoadedIndex) {
            const stopItem =
              lastVisibleIndex + OVERSCREEN_ITEM_COUNT_FOR_FURTHER_LOADING;
            stopItem > storedData.allCount
              ? await loadMoreRooms.run(lastLoadedIndex, storedData.allCount)
              : await loadMoreRooms.run(lastLoadedIndex, stopItem);
          } else {
            const stopItem =
              lastLoadedIndex + OVERSCREEN_ITEM_COUNT_FOR_FURTHER_LOADING;
            await loadMoreRooms.run(lastLoadedIndex, stopItem);
          }
        }
      }
    },
    [storedData, loadMoreRooms, isAllLoaded, isZeroItemCount, storedRooms],
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
