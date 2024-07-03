import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, renderHook } from "@testing-library/react";
import { ContextMenuProvider } from "../src/shared/features/ContextMenu/ContextMenu";
import { NotifyProvider } from "../src/shared/features/Notification/Notification";
import { StoreProvider } from "../src/shared/store/StoreProvider";
import { ConfirmPopupProvider } from "../src/shared/features/ConfirmPopup/ConfirmPopup";
import { WatchdogProvider } from "../src/shared/api/watchdog/useWatchdog";

const wrapper = ({ children }: { children: ReactNode }) => (
  <StoreProvider>
    <WatchdogProvider>
      <NotifyProvider>
        <ConfirmPopupProvider>
          <ContextMenuProvider>
            <MemoryRouter>{children}</MemoryRouter>
          </ContextMenuProvider>
        </ConfirmPopupProvider>
      </NotifyProvider>
    </WatchdogProvider>
  </StoreProvider>
);

export const customRenderHook = <TArgs extends unknown[], TResult>(
  // eslint-disable-next-line no-unused-vars
  callback: (initialProps: TArgs) => TResult,
) => renderHook(callback, { wrapper });

export const customRender = (ui: ReactNode) => {
  return render(ui, { wrapper });
};
