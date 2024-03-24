import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowBack,
  IconComet,
  IconExclamationCircle,
  IconExclamationMark,
  IconKey,
  IconLogin,
  IconMail,
  IconPassword,
  IconSend2,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { Dispatch, ReactNode, useEffect, useState } from "react";
import {
  FieldErrors,
  Path,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { codeFormSchema, loginFormSchema } from "../shared/api/api.schema";
import { fetchCode, fetchLogin } from "../shared/api/api";

interface ShowItemState {
  showItem: "login" | "register" | "code";
  setShowItem: Dispatch<ShowItemState["showItem"]>;
}

interface EmailState {
  email: string;
  setEmail: Dispatch<EmailState["email"]>;
}

interface ErrorState {
  error: { isShow: boolean; text: string };
  setError: Dispatch<ErrorState["error"]>;
}

interface IFormValues {
  email: string;
  password: string;
  username: string;
  code: string;
}

type InputProps = {
  type: Path<IFormValues>;
  register: UseFormRegister<IFormValues>;
  required: boolean;
  isDisabled: boolean;
  errors: FieldErrors<IFormValues>;
};

export default function Auth({ type }: { type: "login" | "register" }) {
  return (
    <Background>
      <Window>
        <AuthContainer type={type} />
      </Window>
    </Background>
  );
}

function Background({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-400">
      <div className="absolute mix-blend-overlay blur w-5/6 h-5/6">
        <BackgroundWindow />
      </div>
      <div className="z-10 w-full h-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}

function BackgroundWindow() {
  return (
    <div className="mix-blend-overlay w-full min-h-80 min-w-80 h-full border-4 rounded-xl border-slate-600 bg-slate-400">
      <div className="flex items-center h-6 w-full bg-slate-500"></div>
      <div className="flex w-full h-full pt-16 pb-24 px-48 justify-center items-center"></div>
    </div>
  );
}

function Window({ children }: { children: ReactNode }) {
  return (
    <div className=" flex flex-col bg-slate-400 w-1/2 min-w-96 max-w-2xl h-1/2 min-h-96 p-1 rounded-xl border-2 border-slate-600 shadow-xl">
      <p className="text-lg w-full text-center font-light tracking-widest uppercase select-none">
        Telescope
      </p>
      <div className="flex justify-center items-center border-t-2 border-slate-500 bg-gray-100 w-full h-full mt-1 rounded-b-xl">
        {children}
      </div>
    </div>
  );
}

function AuthContainer({ type }: { type: "login" | "register" }) {
  const [showItem, setShowItem] = useState<ShowItemState["showItem"]>(type);
  const [error, setError] = useState<ErrorState["error"]>({
    isShow: false,
    text: "",
  });
  const [email, setEmail] = useState<EmailState["email"]>("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/login/code" && showItem !== "code") {
      navigate("/login");
      // /login/code route protection
    }
  }, [location]);

  function handleCodeRequired(email: string) {
    setShowItem("code");
    navigate("/login/code");
    setEmail(email);
  }

  function handleClick(toForm: "login" | "register") {
    setEmail("");
    setShowItem(toForm);
    navigate(`/${toForm}`);
  }

  return (
    <div className="overflow-hidden relative flex flex-row justify-center items-center w-full h-full select-none">
      <LoginForm
        isShow={showItem === "login"}
        handleCodeRequired={handleCodeRequired}
        handleClick={handleClick}
        error={error}
        setError={setError}
      />
      <CodeForm
        isShow={showItem === "code"}
        email={email}
        handleClick={handleClick}
        error={error}
        setError={setError}
      />
      <RegisterForm
        isShow={showItem === "register"}
        handleClick={handleClick}
      />
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
}

function ErrorNotification({
  error,
  setError,
}: {
  error: ErrorState["error"];
  setError: ErrorState["setError"];
}) {
  const unshowError = () => setError({ ...error, isShow: false });

  useEffect(() => {
    if (error.isShow) {
      setTimeout(() => {
        unshowError();
      }, 3000);
    }
  }, [error.isShow]);

  return (
    <div
      className="absolute w-5/6 place-self-start bg-slate-100 border-2 border-red-600 rounded-xl flex justify-center items-center shadow-xl duration-500"
      style={{
        transform: error.isShow ? `translateY(50%)` : `translateY(-150%)`,
        filter: error.isShow ? `blur(0px)` : `blur(4px)`,
      }}
    >
      <div className="w-full flex flex-row m-2 justify-between  items-center">
        <IconExclamationCircle className="text-red-600 m-2" size={24} />
        <p className="text-center">{error.text}</p>
        <button
          onClick={unshowError}
          className="p-1 m-2 rounded-full border-2 border-slate-200 hover:bg-slate-200"
        >
          <IconX size={16} />
        </button>
      </div>
    </div>
  );
}

function Input({ type, register, required, isDisabled, errors }: InputProps) {
  let inputType;
  let Icon;
  switch (type) {
    case "email":
      Icon = <IconMail size={24} className="absolute m-2 text-slate-400" />;
      inputType = "email";
      break;
    case "username":
      Icon = <IconUser size={24} className="absolute m-2 text-slate-400" />;
      inputType = "text";
      break;
    case "password":
    case "code":
      Icon = <IconPassword size={24} className="absolute m-2 text-slate-400" />;
      inputType = "password";
      break;
  }

  return (
    <div className="w-full">
      <div className="flex w-full justify-between items-center">
        <label className="uppercase text-sm">{type}</label>
        {errors[type] && (
          <p className="text-sm text-red-600">{errors[type]?.message}</p>
        )}
      </div>
      <div className="flex w-full items-center justify-end ">
        <input
          className={`${type === "code" ? "text-center" : ""} w-full outline-none bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:bg-slate-200 focus:border-slate-700`}
          type={inputType}
          spellCheck={false}
          multiple={false}
          {...register(type, { required })}
          aria-invalid={errors[type] ? "true" : "false"}
          disabled={isDisabled}
        />
        {Icon}
      </div>
    </div>
  );
}

function ButtonSubmit({
  isDisabled,
  children,
}: {
  isDisabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
      formNoValidate={true} // disable html validation
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}

function ButtonCodeCancel({
  isDisabled,
  handleClick,
  children,
}: {
  isDisabled: boolean;
  handleClick: ReturnType<typeof Function>;
  children: ReactNode;
}) {
  return (
    <button
      onClick={() => handleClick("login")}
      type="button"
      className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}

function CodeForm({
  isShow,
  email,
  handleClick,
  error,
  setError,
}: {
  isShow: boolean;
  email: string;
  handleClick: ReturnType<typeof Function>;
  error: ErrorState["error"];
  setError: ErrorState["setError"];
}) {
  const codeError = "You entered an incorrect code";

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({ resolver: zodResolver(codeFormSchema) });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const { success } = await fetchCode({ ...data, email });
    if (!success) setError({ isShow: true, text: codeError });
    if (success) navigate("/");
  };

  return (
    <div
      className="absolute self-center w-5/6 min-w-80 h-2/3 min-h-48 flex justify-center items-center bg-gray-100 rounded-b-xl duration-500"
      style={{
        transform: isShow ? `translateY(0%)` : `translateY(-150%)`,
      }}
    >
      <form
        className="flex flex-col p-4 w-full h-full border-2 border-slate-300 shadow-xl justify-between rounded-xl gap-2 items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <p className="text-2xl text-center">Almost done...</p>
          <p className="text-sm text-center">
            Please enter the verification code sent to your telescope account{" "}
            <b className="text-green-600">{email}</b> on another device:
          </p>
        </div>
        <Input
          type="code"
          register={register}
          required
          isDisabled={!isShow}
          errors={errors}
        />
        <div className="w-full flex justify-between">
          <ButtonCodeCancel isDisabled={!isShow} handleClick={handleClick}>
            <IconArrowBack className="text-slate-600" size={24} />
            Cancel
          </ButtonCodeCancel>
          <ButtonSubmit isDisabled={!isShow}>
            <IconSend2 className="text-slate-600" size={18} />
            Send
          </ButtonSubmit>
        </div>
      </form>
    </div>
  );
}

function LoginForm({
  isShow,
  handleCodeRequired,
  handleClick,
  error,
  setError,
}: {
  isShow: boolean;
  handleCodeRequired: ReturnType<typeof Function>;
  handleClick: ReturnType<typeof Function>;
  error: ErrorState["error"];
  setError: ErrorState["setError"];
}) {
  const authError = "You entered an incorrect username or password";

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const result = await fetchLogin(data);
    if (!result.success) setError({ isShow: true, text: authError });
    if (result.isCodeNeeded) handleCodeRequired(data.email);
    if (result.success && !result.isCodeNeeded) navigate("/");
  };

  return (
    <form
      className="h-full w-full flex flex-col justify-center gap-2 duration-500"
      style={{
        transform: isShow
          ? `translateX(50%) scale(1)`
          : `translateX(-150%) scale(0.75)`,
        opacity: isShow ? "1" : "0",
        filter: isShow ? `blur(0px)` : `blur(4px)`,
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-center text-2xl">Welcome back!</p>
      <Input
        type="email"
        register={register}
        required
        isDisabled={!isShow}
        errors={errors}
      />
      <Input
        type="password"
        register={register}
        required
        isDisabled={!isShow}
        errors={errors}
      />
      <div className="w-full outline-none flex flex-row justify-between items-end">
        <div className="flex flex-col items-start">
          <p className="text-sm font-light">Need an account?</p>
          <button
            type="button"
            onClick={() => handleClick("register")}
            className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
            disabled={!isShow}
          >
            <IconComet className="text-slate-600" size={24} />
            Sign-up
          </button>
        </div>
        <ButtonSubmit isDisabled={!isShow}>
          <IconKey className="text-slate-600" size={24} />
          Login
        </ButtonSubmit>
      </div>
    </form>
  );
}

function RegisterForm({
  isShow,
  handleClick,
}: {
  isShow: boolean;
  handleClick: ReturnType<typeof Function>;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>();

  const onSubmit: SubmitHandler<IFormValues> = (data) => {
    alert(JSON.stringify(data));
  };
  return (
    <form
      style={{
        transform: isShow
          ? `translateX(-50%) scale(1)`
          : `translateX(150%) scale(0.75)`,
        opacity: isShow ? "1" : "0",
        filter: isShow ? `blur(0px)` : `blur(4px)`,
      }}
      className="h-full w-full flex flex-col justify-center gap-2 duration-500"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="w-full text-center text-2xl">Create an account</p>
      <Input
        type="email"
        register={register}
        required
        isDisabled={!isShow}
        errors={errors}
      />
      <Input
        type="username"
        register={register}
        required
        isDisabled={!isShow}
        errors={errors}
      />
      <Input
        type="password"
        register={register}
        required
        isDisabled={!isShow}
        errors={errors}
      />
      <div className="outline-none flex flex-row w-full justify-between items-end py-2">
        <div className="flex flex-col items-start">
          <p className="text-sm font-light">Need to log in?</p>
          <button
            type="button"
            onClick={() => handleClick("login")}
            className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
            disabled={!isShow}
          >
            <IconLogin className="text-slate-600" size={24} />
            Sign-in
          </button>
        </div>
        <ButtonSubmit isDisabled={!isShow}>
          <IconKey className="text-slate-600" size={24} />
          Register
        </ButtonSubmit>
      </div>
    </form>
  );
}
