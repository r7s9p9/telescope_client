import {
  createContext,
  useContext,
  useState,
  useEffect,
  RefObject,
  useCallback,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const dataDefault = {
  isRender: false,
  isShow: false,
  position: { x: 0, y: 0 },
  window: { width: 0, height: 0 },
  content: null as ReactElement | null,
  contentRef: null as RefObject<HTMLDivElement> | null,
};

const MenuContext = createContext<{
  openMenu: (
    // eslint-disable-next-line no-unused-vars
    event: MouseEvent<HTMLElement>,
    // eslint-disable-next-line no-unused-vars
    content: ReactElement,
  ) => void;
  closeMenu: () => void;
}>({
  openMenu: () => {},
  closeMenu: () => {},
});

const MenuViewContext = createContext(dataDefault);

export const useMenuContext = () => useContext(MenuContext);

export const ContextMenuProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(dataDefault);

  const openMenu = (e: MouseEvent<HTMLElement>, content: ReactElement) => {
    e.preventDefault();
    if (!data.isRender) {
      setData({
        isRender: true,
        isShow: false,
        position: { x: e.clientX, y: e.clientY },
        window: { width: window.innerWidth, height: window.innerHeight },
        content,
        contentRef,
      });
    }
  };

  const closeMenu = () => setData(dataDefault);

  const { contentRef } = useOnClickOutside({
    onClickOutside: data.isShow ? closeMenu : () => {},
    detectWithoutOverlayRef: true,
  });

  const calcMenuPosition = useCallback(() => {
    if (contentRef.current && !data.isShow) {
      const maxX = data.window.width - contentRef.current.offsetWidth;
      const maxY = data.window.height - contentRef.current.offsetHeight;

      const x = Math.min(data.position.x, maxX);
      const y = Math.min(data.position.y, maxY);

      setData((prevData) => ({
        ...prevData,
        isShow: true,
        position: { x, y },
      }));
    }
  }, [contentRef, data]);

  useEffect(() => {
    if (data.isRender) calcMenuPosition();
  }, [calcMenuPosition, data.isRender]);

  return (
    <MenuContext.Provider
      value={{
        openMenu,
        closeMenu,
      }}
    >
      <MenuViewContext.Provider value={data}>
        {children}
      </MenuViewContext.Provider>
    </MenuContext.Provider>
  );
};

export const ContextMenuStack = () => {
  const data = useContext(MenuViewContext);
  if (!data.isRender) return <></>;

  return (
    <div
      ref={data.contentRef}
      style={{
        left: data.position.x,
        top: data.position.y,
      }}
      className={`absolute z-50 ${data.isShow ? "visible" : "invisible"}`}
    >
      {data.content}
    </div>
  );
};
