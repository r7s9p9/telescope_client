import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

type Data = {
  isOpen: boolean;
  isMoved: boolean;
  position: { x: number; y: number };
  content: React.ReactElement | null;
};

const dataDefault = {
  isOpen: false,
  isMoved: false,
  position: { x: 0, y: 0 },
  content: null,
};

const MenuContext = createContext<{
  data: Data;
  openMenu: (
    event: React.MouseEvent<HTMLElement>,
    content: React.ReactElement,
  ) => void;
  closeMenu: () => void;
}>({
  data: dataDefault,
  openMenu: () => {},
  closeMenu: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useMenuContext = () => useContext(MenuContext);

export const ContextMenuProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<Data>(dataDefault);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const openMenu = (
    e: React.MouseEvent<HTMLElement>,
    content: React.ReactElement,
  ) => {
    e.preventDefault();
    if (!data.isOpen) {
      setData({
        isOpen: true,
        isMoved: false,
        position: { x: e.clientX, y: e.clientY },
        content: content,
      });
    }
  };

  const closeMenu = () => {
    setData((prevData) => ({ ...prevData, isOpen: false }));
  };

  useEffect(() => {
    if (targetRef.current && !data.isMoved) {
      const maxX = window.innerWidth - targetRef.current.offsetWidth;
      const maxY = window.innerHeight - targetRef.current.offsetHeight;

      setData((prevData) => {
        const x = Math.min(prevData.position.x, maxX);
        const y = Math.min(prevData.position.y, maxY);
        return {
          ...prevData,
          isMoved: true,
          position: { x, y },
        };
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        data.isOpen &&
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
  }, [data, targetRef]);

  return (
    <MenuContext.Provider
      value={{
        data,
        openMenu,
        closeMenu,
      }}
    >
      {children}
      {data.isOpen && (
        <div
          ref={targetRef}
          style={{
            left: data.position.x,
            top: data.position.y,
          }}
          className="absolute z-50"
        >
          {data.content}
        </div>
      )}
    </MenuContext.Provider>
  );
};
