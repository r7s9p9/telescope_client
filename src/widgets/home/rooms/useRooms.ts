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

export function useRooms() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const storeAction = store();
  const storedData = storeAction.rooms().read();
  const storedRooms = storedData?.items;

  const isZeroItemCount = storedData?.allCount === 0;
  const isAllLoaded = !!(
    storedData && storedData.allCount === storedRooms?.length
  );

  const query = useQueryRooms();

  const queryFull = useCallback(
    async (max: number) => {
      const { success, data } = await query.run({ min: 0 as const, max });
      if (success && data) {
        storeAction.rooms().update(data);
      }
      if (!success) console.error("Rooms no success");
    },
    [query, storedData],
  );

  const queryRange = useCallback(
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
              await queryFull(max);
              return;
            }
          }
          storeAction.rooms().update({
            success: data.success,
            allCount: data.allCount,
            items: (storedRooms || []).concat(data.items || []),
          });
        }
        if (storedData.allCount !== data.allCount) await queryFull(max);
      }
      if (!success) console.error("Rooms no success");
    },
    [query, storedData],
  );

  // Reload rooms
  useInterval(() => {
    if (storedRooms) queryFull(storedRooms.length);
  }, RELOAD_INTERVAL);

  useEffect(() => {
    // wrong roomId protection
    if (roomId && !checkRoomId(roomId)) navigate(routes.rooms.path);
    // Initial load data
    if (!storedRooms) queryFull(ITEM_COUNT_FOR_INITIAL_LOADING);
  }, [roomId, storedRooms]);

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
            await queryRange(lastLoadedIndex, storedData.allCount);
          }
          if (lastVisibleIndex > lastLoadedIndex) {
            const stopItem =
              lastVisibleIndex + OVERSCREEN_ITEM_COUNT_FOR_FURTHER_LOADING;
            stopItem > storedData.allCount
              ? await queryRange(lastLoadedIndex, storedData.allCount)
              : await queryRange(lastLoadedIndex, stopItem);
          } else {
            const stopItem =
              lastLoadedIndex + OVERSCREEN_ITEM_COUNT_FOR_FURTHER_LOADING;
            await queryRange(lastLoadedIndex, stopItem);
          }
        }
      }
    },
    [storedData, queryRange],
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
