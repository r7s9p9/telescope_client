import { zodResolver } from "@hookform/resolvers/zod";
import { IconAbc, IconComet, IconPassword } from "@tabler/icons-react";
import {
  FieldErrors,
  Path,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { createRoomFormSchema } from "../../../shared/api/api.schema";
import { Dispatch, useState } from "react";
import { useQueryCreateRoom } from "../../../shared/api/api";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../constants";
import { useLoadRooms } from "../Rooms/useRooms";
import { Text } from "../../../shared/ui/Text/Text";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { Button } from "../../../shared/ui/Button/Button";

export interface IFormValues {
  name: string;
  about: string;
}

export type InputProps = {
  type: Path<IFormValues>;
  register: UseFormRegister<IFormValues>;
  required: boolean;
  errors: FieldErrors<IFormValues>;
};

export function CreateRoom() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({
    resolver: zodResolver(createRoomFormSchema),
  });

  const query = useQueryCreateRoom();
  const loadRooms = useLoadRooms();
  const navigate = useNavigate();

  const [roomType, setRoomType] = useState<"public" | "private" | "single">(
    "private",
  );

  const onSubmit: SubmitHandler<IFormValues> = async (formData) => {
    const { success, data } = await query.run(
      formData.name,
      roomType,
      formData.about,
    );
    // TODO 500 error
    if (success && data.success) {
      loadRooms.run();
      navigate({ pathname: routes.rooms.path + data.roomId });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="flex flex-col items-center w-1/2 bg-slate-50"
      >
        <Text size="xl" font="light" letterSpacing>
          Create a room
        </Text>
        <form
          className="w-full flex flex-col items-end"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input type="name" register={register} required errors={errors} />
          <RadioType roomType={roomType} setRoomType={setRoomType} />
          <Input type="about" register={register} required errors={errors} />
          <Button
            title="Create room"
            type="submit"
            rounded="default"
            className="mt-4 p-2 gap-2 border-2 border-slate-400"
            formNoValidate={true}
          >
            <IconComet className="text-slate-500" size={24} />
            <Text size="md" font="default">
              Create
            </Text>
          </Button>
        </form>
      </Paper>
    </div>
  );
}

function RadioType({
  roomType,
  setRoomType,
}: {
  roomType: "public" | "private" | "single";
  setRoomType: Dispatch<React.SetStateAction<"public" | "private" | "single">>;
}) {
  return (
    <>
      <legend className="w-full font-light text-lg tracking-widest uppercase">
        type
      </legend>
      <div className="flex w-full flex-row justify-between gap-2">
        <div className="relative w-full flex flex-row justify-between items-center tracking-widest font-light">
          <div
            style={{
              transform:
                roomType === "public"
                  ? ""
                  : roomType === "private"
                    ? "translateX(100%)"
                    : "translateX(200%)",
            }}
            className="z-10 absolute border-4 border-slate-400 rounded-lg shadow-inner shadow-slate-300 h-full w-1/3 duration-500 ease-in-out "
          ></div>
          <div
            onClick={() => {
              if (roomType !== "public") {
                setRoomType("public");
              }
            }}
            className={`cursor-pointer grow h-10 border-y-2 border-l-2 border-slate-400 rounded-l-lg flex justify-center items-center select-none text-xl uppercase`}
          >
            Public
          </div>
          <div
            onClick={() => {
              if (roomType !== "private") {
                setRoomType("private");
              }
            }}
            className={`cursor-pointer grow h-10 border-y-2 border-slate-400 flex justify-center items-center select-none text-xl uppercase duration-700`}
          >
            Private
          </div>
          <div
            onClick={() => {
              if (roomType !== "single") {
                setRoomType("single");
              }
            }}
            className={`cursor-pointer grow h-10 border-y-2 border-r-2 border-slate-400 rounded-r-lg  flex justify-center items-center select-none text-xl uppercase`}
          >
            Single
          </div>
        </div>
      </div>
    </>
  );
}

function Input({ type, register, required, errors }: InputProps) {
  let Icon: JSX.Element | undefined;
  if (type === "name") {
    Icon = <IconAbc size={24} className="absolute mx-2 text-slate-400" />;
  }
  if (type === "about") {
    Icon = <IconPassword size={24} className="absolute mx-2 text-slate-400" />;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-between items-end">
        <label className="font-light text-lg tracking-widest uppercase">
          {type}
        </label>
        <p className="pb-0.5 text-sm text-red-600">{errors[type]?.message}</p>
      </div>
      <div className="flex w-full items-center justify-end">
        <input
          className={`text-lg font-medium w-full h-10 duration-300 appearance-none shadow-md shadow-slate-200 ring-slate-300 focus:shadow-slate-400 hover:ring-4 focus:ring-2 outline-none bg-slate-100 border-2 border-slate-400 p-1 rounded-lg focus:bg-slate-50 focus:border-slate-50`}
          type={type}
          spellCheck={false}
          multiple={false}
          aria-invalid={errors[type] ? "true" : "false"}
          {...register(type, { required })}
        />
        {Icon}
      </div>
    </div>
  );
}
