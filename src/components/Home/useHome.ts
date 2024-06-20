import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkRoomId } from "../../shared/lib/uuid";
import { routes } from "../../constants";

export function useHome() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // Wrong roomId protection
  useEffect(() => {
    if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);
}
