import { ReactNode, useEffect, useState } from "react";
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
import { SubmitHandler, UseFormReset, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  codeFormSchema,
  loginFormSchema,
  registerFormSchema,
} from "../../shared/api/api.schema";
import { fetchCode, fetchLogin, fetchRegister } from "../../shared/api/api";
import { routes } from "../../constants";
import { useNotify } from "../notification/notification";
import { NotifyType } from "../notification/types";
import { message } from "./constants";

const useResetForm = (isShow: boolean, reset: UseFormReset<IFormValues>) =>
  useEffect(() => {
    if (isShow) reset();
  }, [isShow]);

export function AuthContainer({ type }: { type: "login" | "register" }) {
  const [showItem, setShowItem] = useState<ShowItemState["showItem"]>(type);
  const [email, setEmail] = useState<EmailState["email"]>("");

  const notify = useNotify();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.isLoggedOut) {
      notify.show.info(message.loggedOut);
      // remove state from location
      navigate({ pathname: location.pathname });
    }
  }, [location.state]);

  // /login/code route protection
  useEffect(() => {
    if (location.pathname === routes.code.path && showItem !== "code") {
      navigate({ pathname: routes.login.path });
    }
  }, [location]);

  function handleCodeRequired(email: string) {
    setShowItem("code");
    navigate({ pathname: routes.code.path });
    setEmail(email);
  }

  const switchForm = {
    toLogin: () => {
      setEmail("");
      setShowItem("login");
      navigate({ pathname: routes.login.path });
    },
    toRegister: () => {
      setEmail("");
      setShowItem("register");
      navigate({ pathname: routes.register.path });
    },
  };

  return (
    <div className="overflow-hidden relative flex flex-row justify-center items-center w-full h-full select-none">
      <LoginForm
        isShow={showItem === "login"}
        handleCodeRequired={handleCodeRequired}
        switchForm={switchForm}
        notify={notify}
      />
      <CodeForm
        isShow={showItem === "code"}
        email={email}
        switchForm={switchForm}
        notify={notify}
      />
      <RegisterForm
        isShow={showItem === "register"}
        switchForm={switchForm}
        notify={notify}
      />
    </div>
  );
}

function Input({ type, register, required, isDisabled, errors }: InputProps) {
  let inputType: "email" | "text" | "password" | undefined;
  let Icon: JSX.Element | undefined;
  if (type === "email") {
    Icon = <IconMail size={24} className="absolute mx-2 text-slate-400" />;
    inputType = "email";
  }
  if (type === "username") {
    Icon = <IconUser size={24} className="absolute mx-2 text-slate-400" />;
    inputType = "text";
  }
  if (type === "password" || type === "code") {
    Icon = <IconPassword size={24} className="absolute mx-2 text-slate-400" />;
    inputType = "password";
  }

  return (
    <div className="w-full">
      <div className="flex w-full justify-between items-end">
        <label className="font-light text-lg tracking-widest uppercase">
          {type}
        </label>
        <p className="pb-0.5 text-sm text-red-600">{errors[type]?.message}</p>
      </div>
      <div className="flex w-full items-center justify-end">
        <input
          className={`${type === "code" ? "text-center" : ""} text-lg font-medium w-full duration-300 ease-out appearance-none shadow-md shadow-slate-200 ring-slate-300 focus:shadow-slate-400 hover:ring-4 focus:ring-2 outline-none bg-slate-100 border-2 border-slate-400 p-1.5 rounded-xl focus:bg-slate-50 focus:border-slate-50`}
          type={inputType}
          spellCheck={false}
          multiple={false}
          aria-invalid={errors[type] ? "true" : "false"}
          disabled={isDisabled}
          {...register(type, { required })}
        />
        {Icon}
      </div>
    </div>
  );
}

function Button({
  type,
  isDisabled,
  handleClick,
  children,
}: {
  type: "submit" | "button";
  isDisabled: boolean;
  handleClick?: ReturnType<typeof Function>;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      onClick={
        typeof handleClick === "function"
          ? () => handleClick()
          : () => undefined
      }
      className="font-light text-lg flex justify-center items-center gap-2 px-2 py-2 w-32 bg-slate-100 outline-none shadow shadow-slate-200 ring-slate-300 border-slate-300 focus:ring-2 focus:shadow-slate-800 focus:bg-slate-50 focus:border-slate-50 active:ring-0 border-2 shadow-sm shadow-slate-400 border-slate-400 rounded-xl hover:ring-4 active:shadow-inner active:shadow-slate-700 active:bg-slate-200 active:border-slate-400 duration-300 ease-out"
      formNoValidate={true} // disable stock html validation
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}

function CodeForm({
  isShow,
  email,
  switchForm,
  notify,
}: {
  isShow: boolean;
  email: string;
  switchForm: {
    toLogin: () => void;
    toRegister: () => void;
  };
  notify: NotifyType;
}) {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({ resolver: zodResolver(codeFormSchema) });

  useResetForm(isShow, reset);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const { success } = await fetchCode({ ...data, email });
    if (!success) notify.show.error(message.badCode);
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
          <p className="text-center tracking-widest font-light text-3xl">
            Almost done...
          </p>
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
        <FormBottomPart type={"code"} isShow={isShow} switchForm={switchForm} />
      </form>
    </div>
  );
}

function FormBottomPart({
  type,
  isShow,
  switchForm,
}: {
  type: "login" | "register" | "code";
  isShow: boolean;
  switchForm: {
    toLogin: () => void;
    toRegister: () => void;
  };
}) {
  let switchButtonHint: JSX.Element | undefined;
  let switchButtonContent: JSX.Element | undefined;
  let submitButtonContent: JSX.Element | undefined;

  if (type === "login") {
    switchButtonHint = <p className="text-sm font-light">Need an account?</p>;
    switchButtonContent = (
      <>
        <IconComet className="text-slate-600" size={24} />
        Sign-up
      </>
    );
    submitButtonContent = (
      <>
        <IconKey className="text-slate-600" size={24} />
        <p>Login</p>
      </>
    );
  }

  if (type === "register") {
    switchButtonHint = <p className="text-sm font-light">Need to log in?</p>;
    switchButtonContent = (
      <>
        <IconLogin className="text-slate-600" size={24} />
        Sign-in
      </>
    );
    submitButtonContent = (
      <>
        <IconKey className="text-slate-600" size={24} />
        <p>Register</p>
      </>
    );
  }

  if (type === "code") {
    switchButtonContent = (
      <>
        <IconArrowBack className="text-slate-600" size={24} />
        Cancel
      </>
    );
    submitButtonContent = (
      <>
        <IconSend2 className="text-slate-600" size={18} />
        Send
      </>
    );
  }

  function handleClick() {
    if (type === "login") switchForm.toRegister();
    if (type === "register") switchForm.toLogin();
    if (type === "code") switchForm.toLogin();
  }

  return (
    <div className="w-full outline-none flex flex-col justify-between">
      {type !== "code" ? switchButtonHint : ""}
      <div className="w-full flex flex-row gap-2 justify-between items-center mt-0.5">
        <Button type={"button"} isDisabled={!isShow} handleClick={handleClick}>
          {switchButtonContent}
        </Button>
        <Button type={"submit"} isDisabled={!isShow}>
          {submitButtonContent}
        </Button>
      </div>
    </div>
  );
}

function LoginForm({
  isShow,
  handleCodeRequired,
  switchForm,
  notify,
}: {
  isShow: boolean;
  handleCodeRequired: ReturnType<typeof Function>;
  switchForm: {
    toLogin: () => void;
    toRegister: () => void;
  };
  notify: NotifyType;
}) {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  useResetForm(isShow, reset);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const result = await fetchLogin(data);
    if (!result.success) notify.show.error(message.badAuth);
    if (result.isCodeNeeded) {
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
      <p className="text-center tracking-widest font-light text-3xl">
        Welcome back!
      </p>
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
      <FormBottomPart type="login" isShow={isShow} switchForm={switchForm} />
    </form>
  );
}

function RegisterForm({
  isShow,
  switchForm,
  notify,
}: {
  isShow: boolean;
  switchForm: {
    toLogin: () => void;
    toRegister: () => void;
  };
  notify: NotifyType;
}) {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  useResetForm(isShow, reset);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    const result = await fetchRegister(data);
    if (!result.success) {
      switch (result.errorCode) {
        case "EMAIL_ALREADY_EXISTS":
          notify.show.error(message.badRegisterEmailExists);
          break;
        case "USERNAME_ALREADY_EXISTS":
          notify.show.error(message.badRegisterUsernameExists);
          break;
        default:
          notify.show.error(message.badServer);
          break;
      }
    } else {
      notify.show.info(message.goodRegister);
      reset();
      navigate({ pathname: routes.login.path });
      switchForm.toLogin();
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
      <p className="text-center tracking-widest font-light text-3xl">
        Create an account
      </p>
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
      <FormBottomPart type="register" isShow={isShow} switchForm={switchForm} />
    </form>
  );
}
