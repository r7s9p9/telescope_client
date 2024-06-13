import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, renderHook } from "@testing-library/react";
import { ContextMenuProvider } from "../src/components/ContextMenu/ContextMenu";
import { NotifyProvider } from "../src/components/Notification/Notification";
import { StoreProvider } from "../src/shared/store/StoreProvider";

const wrapper = ({ children }: { children: ReactNode }) => (
  <StoreProvider>
    <NotifyProvider>
      <ContextMenuProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </ContextMenuProvider>
    </NotifyProvider>
  </StoreProvider>
);

export const customRenderHook = <TArgs extends unknown[], TResult>(
  callback: (initialProps: TArgs) => TResult,
) => renderHook(callback, { wrapper });

export const customRender = (ui: ReactNode) => {
  return render(ui, { wrapper });
};
