import { useNavigate } from "react-router-dom";
import { useQueryCreateRoom } from "../../../shared/api/api";
import { useLoadRooms } from "../Rooms/useRooms";
import { useState } from "react";
import { routes } from "../../../constants";
import {
  roomAboutSchema,
  roomNameSchema,
} from "../../../shared/api/api.schema";

export function useCreateRoom() {
  const query = useQueryCreateRoom();
  const loadRooms = useLoadRooms();
  const navigate = useNavigate();

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

  const schemaValidator = () => {
    const name = roomNameSchema.safeParse(form.name.value);
    if (!name.success) {
      setForm((prevForm) => ({
        ...prevForm,
        name: {
          ...prevForm.name,
          error:
            "The room name must be at least 4 and no more than 32 characters",
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        name: {
          ...prevForm.name,
          error: "",
        },
      }));
    }
    const about = roomAboutSchema.safeParse(form.about.value);
    if (!about.success) {
      setForm((prevForm) => ({
        ...prevForm,
        about: {
          ...prevForm.about,
          error: "The room description must be no more than 80 characters",
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        about: {
          ...prevForm.about,
          error: "",
        },
      }));
    }
    if (!name.success || !about.success) return false;
    return true;
  };

  const run = async () => {
    const validation = schemaValidator();
    if (!validation) return;

    const { success, data } = await query.run(
      form.name.value,
      form.type,
      form.about.value,
    );
    // TODO 500 error
    if (success && data.success) {
      loadRooms.run();
      navigate({ pathname: routes.rooms.path + data.roomId });
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
