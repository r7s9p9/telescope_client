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
import { useActionStore } from "../../../shared/store/StoreProvider";

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
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({
    resolver: zodResolver(createRoomFormSchema),
  });

  const query = useQueryCreateRoom();
  const action = useActionStore();
  const navigate = useNavigate();

  const [roomType, setRoomType] = useState<"public" | "private" | "single">(
    "private",
  );

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const { success, roomId } = await query.run(
      data.name,
      roomType,
      data.about,
    );
    if (success) {
      action.reloadRooms();
      navigate({ pathname: routes.rooms.path + roomId });
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col items-center w-2/3 bg-slate-50 rounded-2xl shadow-xl p-4">
        <p className="pl-4 font-thin tracking-widest text-4xl select-none">
          Create a room
        </p>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <Input type="name" register={register} required errors={errors} />
          <RadioType roomType={roomType} setRoomType={setRoomType} />
          <Input type="about" register={register} required errors={errors} />
          <Button isDisabled={false} />
        </form>
      </div>
    </div>
  );
}

function Button({ isDisabled }: { isDisabled: boolean }) {
  return (
    <button
      type="submit"
      className="mt-4 font-light text-lg flex justify-center items-center gap-2 px-2 py-2 w-32 bg-slate-100 outline-none shadow ring-slate-300 focus:ring-2 focus:shadow-slate-800 focus:bg-slate-50 focus:border-slate-50 active:ring-0 border-2 shadow-slate-400 border-slate-400 rounded-xl hover:ring-4 active:shadow-inner active:shadow-slate-700 active:bg-slate-200 active:border-slate-400 duration-300"
      formNoValidate={true} // disable stock html validation
      disabled={isDisabled}
    >
      <IconComet className="text-slate-500" size={24} />
      Create
    </button>
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
            className="z-10 absolute border-4 border-slate-400 rounded-xl shadow-inner shadow-slate-300 h-full w-1/3 duration-500 ease-in-out "
          ></div>
          <div
            onClick={() => {
              if (roomType !== "public") {
                setRoomType("public");
              }
            }}
            className={`cursor-pointer grow h-10 border-y-2 border-l-2 border-slate-400 rounded-l-xl flex justify-center items-center select-none text-xl uppercase`}
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
            className={`cursor-pointer grow h-10 border-y-2 border-r-2 border-slate-400 rounded-r-xl  flex justify-center items-center select-none text-xl uppercase`}
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
          className={`text-lg font-medium w-full h-10 duration-300 appearance-none shadow-md shadow-slate-200 ring-slate-300 focus:shadow-slate-400 hover:ring-4 focus:ring-2 outline-none bg-slate-100 border-2 border-slate-400 p-1 rounded-xl focus:bg-slate-50 focus:border-slate-50`}
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
