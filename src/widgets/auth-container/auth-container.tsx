import { ReactNode, useEffect, useState } from "react";
import { Notification } from "../notification/notification";
import { NotificationState } from "../notification/types";
import { EmailState, IFormValues, InputProps, ShowItemState } from "./types";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconArrowBack,
  IconComet,
  IconKey,
  IconLogin,
  IconMail,
  IconPassword,
  IconSend2,
  IconUser,
} from "@tabler/icons-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  codeFormSchema,
  loginFormSchema,
  registerFormSchema,
} from "../../shared/api/api.schema";
import { fetchCode, fetchLogin, fetchRegister } from "../../shared/api/api";

export function AuthContainer({ type }: { type: "login" | "register" }) {
  const [showItem, setShowItem] = useState<ShowItemState["showItem"]>(type);
  const [notification, setNotification] = useState<
    NotificationState["notification"]
  >({
    isShow: false,
    type: "info",
    text: "",
  });
  const [email, setEmail] = useState<EmailState["email"]>("");

  const location = useLocation();
  const navigate = useNavigate();

  // /login/code route protection
  useEffect(() => {
    if (location.pathname === "/login/code" && showItem !== "code") {
      navigate("/login");
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
        notification={notification}
        setNotification={setNotification}
      />
      <CodeForm
        isShow={showItem === "code"}
        email={email}
        handleClick={handleClick}
        notification={notification}
        setNotification={setNotification}
      />
      <RegisterForm
        isShow={showItem === "register"}
        handleClick={handleClick}
        notification={notification}
        setNotification={setNotification}
      />
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
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
      formNoValidate={true} // disable stock html validation
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
  notification,
  setNotification,
}: {
  isShow: boolean;
  email: string;
  handleClick: ReturnType<typeof Function>;
  notification: NotificationState["notification"];
  setNotification: NotificationState["setNotification"];
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
    if (!success)
      setNotification({ isShow: true, type: "error", text: codeError });
    if (success) navigate("/");
  };

  return (
    <div
      className="absolute self-center w-5/6 h-2/3 flex justify-center items-center bg-gray-100 rounded-b-xl duration-500"
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
        <div className="w-full flex gap-4 justify-between">
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

function FormBottomPart({
  type,
  isShow,
  handleClick,
}: {
  type: "login" | "register";
  isShow: boolean;
  handleClick: ReturnType<typeof Function>;
}) {
  let switchButton;
  let switchButtonHint;
  if (type === "login") {
    switchButton = (
      <>
        <IconComet className="text-slate-600" size={24} />
        Sign-up
      </>
    );
    switchButtonHint = "Need an account?";
  }
  if (type === "register") {
    switchButton = (
      <>
        <IconLogin className="text-slate-600" size={24} />
        Sign-in
      </>
    );
    switchButtonHint = "Need to log in?";
  }
  return (
    <div className="w-full outline-none flex flex-row gap-4 justify-between items-end">
      <div className="flex flex-col items-start">
        <p className="text-sm font-light">{switchButtonHint}</p>
        <button
          type="button"
          onClick={() => handleClick(type === "login" ? "register" : "login")}
          className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
          disabled={!isShow}
        >
          {switchButton}
        </button>
      </div>
      <ButtonSubmit isDisabled={!isShow}>
        <IconKey className="text-slate-600" size={24} />
        <p className="capitalize">{type}</p>
      </ButtonSubmit>
    </div>
  );
}

function LoginForm({
  isShow,
  handleCodeRequired,
  handleClick,
  notification,
  setNotification,
}: {
  isShow: boolean;
  handleCodeRequired: ReturnType<typeof Function>;
  handleClick: ReturnType<typeof Function>;
  notification: NotificationState["notification"];
  setNotification: NotificationState["setNotification"];
}) {
  const authErrorMessage = "You entered an incorrect username or password";
  const loggedOutMessage =
    "You have successfully logged out of your account. See you soon!";

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  // Show notification when logout
  const { state } = useLocation();
  useEffect(() => {
    if (state?.isLoggedOut) {
      setNotification({ isShow: true, type: "info", text: loggedOutMessage });
    }
  }, [state]);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const result = await fetchLogin(data);
    if (!result.success)
      setNotification({ isShow: true, type: "error", text: authErrorMessage });
    if (result.isCodeNeeded) {
      reset();
      handleCodeRequired(data.email);
    }
    if (result.success && !result.isCodeNeeded) navigate("/");
  };

  return (
    <form
      className="absolute h-3/4 max-h-96 w-3/4 max-w-96 flex flex-col justify-center gap-2 duration-500"
      style={{
        transform: isShow
          ? `translateX(0%) scale(1)`
          : `translateX(-100%) scale(0.75)`,
        opacity: isShow ? "1" : "0",
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
      <FormBottomPart type="login" isShow={isShow} handleClick={handleClick} />
    </form>
  );
}

function RegisterForm({
  isShow,
  handleClick,
  notification,
  setNotification,
}: {
  isShow: boolean;
  handleClick: ReturnType<typeof Function>;
  notification: NotificationState["notification"];
  setNotification: NotificationState["setNotification"];
}) {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const result = await fetchRegister(data);
    if (!result.success) {
      switch (result.errorCode) {
        case "EMAIL_ALREADY_EXISTS":
          setNotification({
            isShow: true,
            type: "error",
            text: "Email already exists",
          });
          break;
        case "USERNAME_ALREADY_EXISTS":
          setNotification({
            isShow: true,
            type: "error",
            text: "Username already exists",
          });
          break;
        default:
          setNotification({
            isShow: true,
            type: "error",
            text: "Server error",
          });
          break;
      }
    } else {
      setNotification({
        isShow: true,
        type: "info",
        text: "You have successfully registered! Please sign in",
      });
      reset();
      navigate("/login");
      handleClick("login");
    }
  };
  return (
    <form
      style={{
        transform: isShow
          ? `translateX(0%) scale(1)`
          : `translateX(100%) scale(0.75)`,
        opacity: isShow ? "1" : "0",
      }}
      className="absolute h-3/4 max-h-96 w-3/4 max-w-96 flex flex-col justify-center gap-2 duration-500"
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
      <FormBottomPart
        type="register"
        isShow={isShow}
        handleClick={handleClick}
      />
    </form>
  );
}
