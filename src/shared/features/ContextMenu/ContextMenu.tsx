import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from "react";

const dataDefault = {
  isRender: false,
  isShow: false,
  position: { x: 0, y: 0 },
  window: { width: 0, height: 0 },
  content: null as React.ReactElement | null,
  targetRef: null as RefObject<HTMLDivElement> | null,
};

const MenuContext = createContext<{
  openMenu: (
    event: React.MouseEvent<HTMLElement>,
    content: React.ReactElement,
  ) => void;
  closeMenu: () => void;
}>({
  openMenu: () => {},
  closeMenu: () => {},
});

const MenuViewContext = createContext(dataDefault);

// eslint-disable-next-line react-refresh/only-export-components
export const useMenuContext = () => useContext(MenuContext);

export const ContextMenuProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState(dataDefault);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const openMenu = (
    e: React.MouseEvent<HTMLElement>,
    content: React.ReactElement,
  ) => {
    e.preventDefault();
    if (!data.isRender) {
      setData({
        isRender: true,
        isShow: false,
        position: { x: e.clientX, y: e.clientY },
        window: { width: window.innerWidth, height: window.innerHeight },
        content,
        targetRef,
      });
    }
  };

  const closeMenu = () => setData(dataDefault);

  const calcMenuPosition = useCallback(() => {
    if (targetRef.current && !data.isShow) {
      const maxX = data.window.width - targetRef.current.offsetWidth;
      const maxY = data.window.height - targetRef.current.offsetHeight;

      const x = Math.min(data.position.x, maxX);
      const y = Math.min(data.position.y, maxY);

      setData((prevData) => ({
        ...prevData,
        isShow: true,
        position: { x, y },
      }));
    }
  }, [data]);

  useEffect(() => {
    calcMenuPosition();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        data.isRender &&
        targetRef.current &&
        !targetRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    // Prevent opening stock context menu in this context menu
    const handleContextMenu = (event: MouseEvent) => {
      if (
        targetRef.current &&
        targetRef.current.contains(event.target as Node)
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [calcMenuPosition, data]);

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
      ref={data.targetRef}
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
