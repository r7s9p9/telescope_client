import { ReactNode, useEffect, useState } from "react";
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
import { routes } from "../../constants";
import { ShowType, useNotification } from "../notification/notification";

export function AuthContainer({ type }: { type: "login" | "register" }) {
  const notify = useNotification();

  const loggedOutMessage =
    "You have successfully logged out of your account. See you soon!";

  const [showItem, setShowItem] = useState<ShowItemState["showItem"]>(type);
  const [email, setEmail] = useState<EmailState["email"]>("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.isLoggedOut) {
      notify("info", loggedOutMessage);
      // remove state from location
      navigate({ pathname: location.pathname });
    }
  }, [location.state]);

  // /login/code route protection
  useEffect(() => {
    if (location.pathname === "/login/code" && showItem !== "code") {
      navigate({ pathname: routes.login.path });
    }
  }, [location]);

  function handleCodeRequired(email: string) {
    setShowItem("code");
    navigate({ pathname: routes.code.path });
    setEmail(email);
  }

  function handleClick(toForm: "login" | "register") {
    setEmail("");
    setShowItem(toForm);
    if (toForm === "login") navigate({ pathname: routes.login.path });
    if (toForm === "register") navigate({ pathname: routes.register.path });
  }

  return (
    <div className="overflow-hidden relative flex flex-row justify-center items-center w-full h-full select-none">
      <LoginForm
        isShow={showItem === "login"}
        handleCodeRequired={handleCodeRequired}
        handleClick={handleClick}
        notify={notify}
      />
      <CodeForm
        isShow={showItem === "code"}
        email={email}
        handleClick={handleClick}
        notify={notify}
      />
      <RegisterForm
        isShow={showItem === "register"}
        handleClick={handleClick}
        notify={notify}
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
  notify,
}: {
  isShow: boolean;
  email: string;
  handleClick: ReturnType<typeof Function>;
  notify: ShowType;
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
    if (!success) notify("error", codeError);
    if (success) {
      navigate({ pathname: routes.home.path });
    }
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
  notify,
}: {
  isShow: boolean;
  handleCodeRequired: ReturnType<typeof Function>;
  handleClick: ReturnType<typeof Function>;
  notify: ShowType;
}) {
  const authErrorMessage = "You entered an incorrect username or password";

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const result = await fetchLogin(data);
    if (!result.success) notify("error", authErrorMessage);
    if (result.isCodeNeeded) {
      reset();
      handleCodeRequired(data.email);
    }
    if (result.success && !result.isCodeNeeded) {
      navigate({ pathname: routes.code.path });
    }
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
  notify,
}: {
  isShow: boolean;
  handleClick: ReturnType<typeof Function>;
  notify: ShowType;
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
          notify("error", "Email already exists");
          break;
        case "USERNAME_ALREADY_EXISTS":
          notify("error", "Username already exists");
          break;
        default:
          notify("error", "Server error");
          break;
      }
    } else {
      notify("info", "You have successfully registered! Please sign in");
      reset();
      navigate({ pathname: routes.login.path });
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
