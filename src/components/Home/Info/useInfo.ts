import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../../constants";

export function useInfo() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const exit = useCallback(() => {
    navigate({ pathname: `${routes.rooms.path}/${roomId}` });
  }, [navigate, roomId]);

  return {
    handleCloseClick: exit,
  };
}
