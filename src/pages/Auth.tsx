import { Dispatch, ReactNode } from "react";
import { NotifyStack } from "../widgets/Notification/Notification";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconKey,
  IconMail,
  IconPassword,
  IconSend2,
  IconUser,
} from "@tabler/icons-react";
import {
  Path,
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  UseFormReset,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  codeFormSchema,
  emailSchema,
  loginFormSchema,
  passwordSchema,
  registerFormSchema,
} from "../shared/api/api.schema";
import {
  useQueryCode,
  useQueryLogin,
  useQueryRegister,
} from "../shared/api/api";
import { routes } from "../constants";
import { useNotify } from "../widgets/Notification/Notification";
import { NotifyType } from "../widgets/Notification/types";
import { Spinner } from "../shared/ui/Spinner/Spinner";
import { Text } from "../shared/ui/Text/Text";
import { Button } from "../shared/ui/Button/Button";
import { Paper } from "../shared/ui/Paper/Paper";
import { InputField } from "../shared/ui/InputField/InputField";
import { env } from "../shared/lib/env";

const message = {
  loggedOut:
    "You have successfully logged out of your account. See you soon!" as const,
  badCode: "You entered an incorrect code" as const,
  badAuth: "You entered an incorrect username or password" as const,
  goodRegister: "You have successfully registered! Please sign in" as const,
  badRegisterEmailExists: "Email already exists" as const,
  badRegisterUsernameExists: "Username already exists" as const,
  badServer: "Server error" as const,
};

interface ShowItemState {
  showItem: "login" | "register" | "code";
  setShowItem: Dispatch<ShowItemState["showItem"]>;
}

interface EmailState {
  email: string;
  setEmail: Dispatch<EmailState["email"]>;
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
      <NotifyStack />
      <AuthContainer type={type} />
    </Background>
  );
}

function Background({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex justify-center bg-slate-300">
      {children}
    </div>
  );
}

const useResetForm = (isShow: boolean, reset: UseFormReset<IFormValues>) =>
  useEffect(() => {
    if (isShow) reset();
  }, [isShow, reset]);

function AuthContainer({ type }: { type: "login" | "register" }) {
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
  }, [location, navigate, notify.show]);

  // /login/code route protection
  useEffect(() => {
    if (location.pathname === routes.code.path && showItem !== "code") {
      navigate({ pathname: routes.login.path });
    }
  }, [location, navigate, showItem]);

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
    <>
      <div className="flex w-full justify-between items-center">
        <Text size="md" font="light" letterSpacing uppercase>
          {type}
        </Text>
        <Text size="sm" font="bold" className="text-red-600">
          {errors[type]?.message}
        </Text>
      </div>
      <div className="flex w-full items-center justify-end">
        <input
          className={`${type === "code" ? "text-center" : ""} text-lg font-medium w-full duration-300 appearance-none shadow-md shadow-slate-200 ring-slate-300 focus:shadow-slate-400 hover:ring-4 focus:ring-2 outline-none bg-slate-100 border-2 border-slate-400 p-1.5 rounded-lg focus:bg-slate-50 focus:border-slate-50`}
          type={inputType}
          spellCheck={false}
          multiple={false}
          aria-invalid={errors[type] ? "true" : "false"}
          disabled={isDisabled}
          {...register(type, { required })}
        />
        {Icon}
      </div>
    </>
  );
}

function useLogin({
  handleCodeRequired,
}: {
  handleCodeRequired: ReturnType<typeof Function>;
}) {
  const query = useQueryLogin();
  const navigate = useNavigate();
  const notify = useNotify();

  const defaultForm = {
    email: { value: "", error: "" },
    password: { value: "", error: "" },
  };

  const [form, setForm] = useState(defaultForm);
  const setEmail = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, email: { value, error: "" } }));
  };
  const setPassword = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, password: { value, error: "" } }));
  };

  const reset = () => {
    setForm(defaultForm);
  };

  const schemaValidator = () => {
    const email = emailSchema.safeParse(form.email.value);
    if (!email.success) {
      setForm((prevForm) => ({
        ...prevForm,
        email: {
          ...prevForm.email,
          error: "Please enter a correct email address",
        },
      }));
    }
    const password = passwordSchema.safeParse(form.password.value);
    if (!password.success) {
      setForm((prevForm) => ({
        ...prevForm,
        password: {
          ...prevForm.password,
          error: `Must be at least ${env.passwordRange.min} and no more than ${env.passwordRange.max} characters`,
        },
      }));
    }
    if (!email.success || !password.success) return false;
    return true;
  };

  const run = async () => {
    const validation = schemaValidator();
    if (!validation) return;

    const { success, data } = await query.run({
      email: form.email.value,
      password: form.password.value,
    });
    // TODO make warning 500
    if (!success) {
      notify.show.error(message.badAuth);
    }
    if (!query.isLoading && success) {
      if (data.success && data.code)
        if (data.success && !data.code) handleCodeRequired(form.email.value);
      navigate({ pathname: routes.home.path });
      if (!data.success) notify.show.error(message.badAuth);
    }
  };

  return {
    form,
    setEmail,
    setPassword,
    run,
    reset,
    isLoading: query.isLoading,
  };
}

function LoginForm({
  isShow,
  handleCodeRequired,
  switchForm,
}: {
  isShow: boolean;
  handleCodeRequired: ReturnType<typeof Function>;
  switchForm: {
    toLogin: () => void;
    toRegister: () => void;
  };
}) {
  const { form, setEmail, setPassword, run, reset, isLoading } = useLogin({
    handleCodeRequired,
  });

  return (
    <Paper
      rounded="lg"
      shadow="xl"
      padding={4}
      style={{
        transform: isShow ? "" : "translateX(-250%)",
        opacity: isShow ? "1" : "0",
      }}
      className="absolute w-3/4 min-w-[480px] max-w-[600px] flex flex-col justify-center gap-2 duration-500 transform-gpu"
    >
      <div className="flex justify-between items-center">
        <Text size="xl" font="light" letterSpacing>
          Login to account
        </Text>
        {isLoading && <Spinner size={32} />}
      </div>
      <InputField
        label="Email"
        size="md"
        disabled={!isShow || isLoading}
        value={form.email.value}
        setValue={setEmail}
        error={form.email.error}
        rightSection={
          <IconMail size={28} className="text-slate-500" strokeWidth="1" />
        }
      />
      <InputField
        label="Password"
        sensitive
        size="md"
        disabled={!isShow || isLoading}
        value={form.password.value}
        setValue={setPassword}
        error={form.password.error}
      />
      <div className="pt-2 w-full flex flex-row justify-between items-center">
        <div className="flex flex-col items-start">
          <Text size="sm" font="light" className="text-slate-800">
            Need an account?
          </Text>
          <Button
            title="Sign-up"
            disabled={!isShow || isLoading}
            onClick={() => {
              reset(), switchForm.toRegister();
            }}
            noHover
          >
            <Text size="sm" font="default" underline className="text-slate-800">
              Sign-up
            </Text>
          </Button>
        </div>
        <Button
          title="Login"
          onClick={run}
          disabled={!isShow || isLoading}
          rounded="default"
          className="px-4 gap-2 ring-2 ring-slate-300"
        >
          <IconKey className="text-slate-800" strokeWidth="1.5" size={24} />
          <Text size="md" font="default" className="text-slate-800">
            Login
          </Text>
        </Button>
      </div>
    </Paper>
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
  const query = useQueryCode();

  const onSubmit: SubmitHandler<IFormValues> = async (formData) => {
    const { success, data } = await query.run({ ...formData, email });

    if (!query.isLoading) {
      if (!success || !data.success) notify.show.error(message.badCode);
      if (success && data.success) navigate({ pathname: routes.home.path });
    }
  };

  return (
    <Paper
      rounded="lg"
      className="bg-slate-50 ring-slate-50 ring-8 shadow-xl absolute w-2/3 min-w-72 max-w-md flex flex-col justify-around gap-4 duration-700 transform-gpu"
      style={{
        transform: isShow ? "" : "translateX(250%)",
        opacity: isShow ? "1" : "0",
      }}
    >
      <Text size="xl" font="light" letterSpacing className="p-2 text-center">
        Almost done
      </Text>
      <Text size="md" font="light" className="text-justify">
        Please enter the verification code sent to your telescope account{" "}
        <b className="text-green-600">{email}</b> on another device:
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="code"
          register={register}
          required
          isDisabled={!isShow}
          errors={errors}
        />
        <div className="pt-2 w-full flex flex-row justify-between items-center">
          <div className="flex flex-col items-start">
            <Text size="sm" font="light" className="text-slate-800">
              Not your account?
            </Text>
            <Button
              title="Sign-in"
              disabled={!isShow || query.isLoading}
              onClick={() => switchForm.toLogin()}
              noHover
              className="hover:ring-2 gap-2 ring-slate-400 rounded-md"
            >
              <Text size="sm" font="default" className="text-slate-800">
                Sign-in
              </Text>
            </Button>
          </div>

          {query.isLoading && <Spinner size={32} />}

          <Button
            title="Register"
            disabled={!isShow || query.isLoading}
            type="submit"
            rounded="default"
            className="px-4 gap-2 border-2 border-slate-400"
          >
            <IconSend2 className="text-slate-800" strokeWidth="1.5" size={24} />
            <Text size="md" font="default" className="text-slate-800">
              Send
            </Text>
          </Button>
        </div>
      </form>
    </Paper>
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
  const query = useQueryRegister();

  const onSubmit: SubmitHandler<IFormValues> = async (formData) => {
    const { success, data } = await query.run(formData);
    // TODO make warning 500
    if (!success) return;
    if (!data.success) {
      switch (data.errorCode) {
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
    <Paper
      rounded="lg"
      className="bg-slate-50 ring-slate-50 ring-8 shadow-xl absolute w-2/3 min-w-72 max-w-md flex flex-col justify-center gap-2 duration-500 ease-in-out transform-gpu"
      style={{
        transform: isShow ? "" : "translateX(250%)",
        opacity: isShow ? "1" : "0",
      }}
    >
      <Text size="xl" font="light" letterSpacing className="p-2 text-center">
        Create an account
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          register={register}
          required
          isDisabled={!isShow || query.isLoading}
          errors={errors}
        />
        <Input
          type="username"
          register={register}
          required
          isDisabled={!isShow || query.isLoading}
          errors={errors}
        />
        <Input
          type="password"
          register={register}
          required
          isDisabled={!isShow || query.isLoading}
          errors={errors}
        />
        <div className="pt-2 w-full flex flex-row justify-between items-center">
          <div className="flex flex-col items-start">
            <Text size="sm" font="light" className="text-slate-800">
              Need to log in?
            </Text>
            <Button
              title="Sign-in"
              disabled={!isShow || query.isLoading}
              onClick={() => switchForm.toLogin()}
              noHover
            >
              <Text size="sm" font="default" className="text-slate-800">
                Sign-in
              </Text>
            </Button>
          </div>

          {query.isLoading && <Spinner size={32} />}

          <Button
            title="Register"
            disabled={!isShow || query.isLoading}
            type="submit"
            rounded="default"
            className="px-4 gap-2 border-2 border-slate-400"
          >
            <IconKey className="text-slate-800" strokeWidth="1.5" size={24} />
            <Text size="md" font="default" className="text-slate-800">
              Register
            </Text>
          </Button>
        </div>
      </form>
    </Paper>
  );
}
