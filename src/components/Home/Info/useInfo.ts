import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../../constants";
import { useLang } from "../../../shared/features/LangProvider/LangProvider";

export function useInfo() {
  const { lang } = useLang();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const exit = useCallback(() => {
    navigate({ pathname: `${routes.rooms.path}/${roomId}` });
  }, [navigate, roomId]);

  return {
    handleCloseClick: exit,
    lang,
  };
}
