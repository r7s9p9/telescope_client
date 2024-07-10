import { useLocation, useNavigate } from "react-router-dom";
import { useQueryCreateRoom } from "../../../shared/api/api.model";
import { useLoadRooms } from "../Rooms/useRooms";
import { useState } from "react";
import { routes } from "../../../constants";
import { useNotify } from "../../../shared/features/Notification/Notification";
import { useOnClickOutside } from "../../../shared/hooks/useOnClickOutside";
import { useLang } from "../../../shared/features/LangProvider/LangProvider";

export function useCreateRoom() {
  const { lang } = useLang();
  const query = useQueryCreateRoom();
  const loadRooms = useLoadRooms();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();

  const onClose = () => {
    if (!location.state?.prevPath) {
      navigate(routes.home.path);
      return;
    }
    navigate(location.state?.prevPath);
  };

  const { contentRef, overlayRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  const [form, setForm] = useState({
    name: { value: "", error: "" },
    type: "private" as "public" | "private" | "single",
    about: { value: "", error: "" },
  });

  const handleSelectType = (value: "public" | "private" | "single") => {
    setForm((prevForm) => ({ ...prevForm, type: value }));
  };

  const setName = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, name: { value, error: "" } }));
  };

  const setAbout = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, about: { value, error: "" } }));
  };

  const run = async () => {
    const { success, response, requestError, responseError } = await query.run({
      roomInfo: {
        name: form.name.value,
        type: form.type,
        about: form.about.value,
      },
    });
    if (!success && requestError) {
      setForm((prevForm) => ({
        ...prevForm,
        name: { ...prevForm.name, error: requestError.name || "" },
        about: { ...prevForm.about, error: requestError.about || "" },
      }));
      return;
    }

    if (!success) {
      notify.show.error(responseError || lang.error.UNKNOWN_MESSAGE);
      return;
    }

    if (response.success) {
      await loadRooms.run();
      navigate({ pathname: `${routes.rooms.path}/${response.roomId}` });
    } else {
      notify.show.error(lang.error.UNKNOWN_MESSAGE);
    }
  };

  return {
    form,
    setName,
    setAbout,
    handleSelectType,
    run,
    onClose,
    isLoading: query.isLoading,
    contentRef,
    overlayRef,
    lang,
  };
}
