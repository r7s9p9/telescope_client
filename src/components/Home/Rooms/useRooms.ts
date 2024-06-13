import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo } from "react";
import { useQueryRooms } from "../../../shared/api/api.model";
import { useStore } from "../../../shared/store/store";
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
import { useNotify } from "../../Notification/Notification";
import { langError } from "../../../locales/en";

// Load for the first time and refresh
export function useLoadRooms() {
  const query = useQueryRooms();
  const notify = useNotify();
  const storeAction = useStore().rooms();
  const storedRooms = storeAction.read().items;

  const run = useCallback(async () => {
    const max = storedRooms?.length || ITEM_COUNT_FOR_INITIAL_LOADING;
    const { success, response, requestError, responseError } = await query.run({
      range: { min: 0 as const, max },
    });

    if (!success && requestError) {
      notify.show.error(requestError);
      return;
    }
    if (!success && responseError) {
      notify.show.error(responseError);
      return;
    }

    if (!success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
      return;
    }

    storeAction.update(response);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedRooms?.length, query, storeAction]);

  return { run };
}

// On scroll
export function useLoadMoreRooms() {
  const query = useQueryRooms();
  const notify = useNotify();
  const storeAction = useStore().rooms();
  const storedData = storeAction.read();

  const run = useCallback(
    async (min: number, max: number) => {
      const { success, response, requestError, responseError } =
        await query.run({ range: { min, max } });

      if (!success && requestError) {
        notify.show.error(requestError);
        return;
      }
      if (!success && responseError) {
        notify.show.error(responseError);
        return;
      }

      if (!success) {
        notify.show.error(langError.UNKNOWN_MESSAGE);
        return;
      }

      if (response.items) {
        const newRooms = response.items.filter(
          (loaded) =>
            !storedData.items?.some(
              (stored) => stored.roomId === loaded.roomId,
            ),
        );
        storeAction.update({
          items: (storedData?.items || []).concat(newRooms),
          allCount: response.allCount,
        });
      } else {
        notify.show.error(langError.RESPONSE_COMMON_MESSAGE);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, storeAction, storedData.items],
  );

  return { run };
}

export function useRooms() {
  const { roomId } = useParams();

  const storedData = useStore().rooms().read();
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
