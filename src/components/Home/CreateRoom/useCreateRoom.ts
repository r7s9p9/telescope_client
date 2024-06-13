import { useNavigate } from "react-router-dom";
import { useQueryCreateRoom } from "../../../shared/api/api.model";
import { useLoadRooms } from "../Rooms/useRooms";
import { useState } from "react";
import { routes } from "../../../constants";
import { langError } from "../../../locales/en";
import { useNotify } from "../../Notification/Notification";

export function useCreateRoom() {
  const query = useQueryCreateRoom();
  const loadRooms = useLoadRooms();
  const navigate = useNavigate();
  const notify = useNotify();

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
      notify.show.error(responseError || langError.UNKNOWN_MESSAGE);
      return;
    }

    if (response.success) {
      loadRooms.run();
      navigate({ pathname: routes.rooms.path + response.roomId });
    } else {
      notify.show.error(langError.UNKNOWN_MESSAGE);
    }
  };

  return {
    form,
    setName,
    setAbout,
    handleSelectType,
    run,
    isLoading: query.isLoading,
  };
}
