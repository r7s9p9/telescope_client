import { Dispatch, ReactNode } from "react";
import { NotifyStack } from "../widgets/Notification/Notification";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconKey, IconMail, IconSend2, IconUser } from "@tabler/icons-react";
import {
  codeSchema,
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "../shared/api/api.schema";
import {
  useQueryCode,
  useQueryLogin,
  useQueryRegister,
} from "../shared/api/api";
import { routes } from "../constants";
import { useNotify } from "../widgets/Notification/Notification";
import { Spinner } from "../shared/ui/Spinner/Spinner";
import { Text } from "../shared/ui/Text/Text";
import { Paper } from "../shared/ui/Paper/Paper";
import { InputField } from "../shared/ui/InputField/InputField";
import { env } from "../shared/lib/env";
import { Button } from "../shared/ui/Button/Button";

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

function AuthContainer({ type }: { type: "login" | "register" }) {
  const [showItem, setShowItem] = useState<ShowItemState["showItem"]>(type);
  const [email, setEmail] = useState("");

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
      <RegisterForm isShow={showItem === "register"} switchForm={switchForm} />
      <CodeForm
        isShow={showItem === "code"}
        email={email}
        switchForm={switchForm}
      />
    </div>
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
    if (!success || !data.success) {
      notify.show.error(message.badAuth);
    }
    if (!query.isLoading && success) {
      if (data.success && data.code) {
        handleCodeRequired(form.email.value);
      }
      if (data.success && !data.code) {
        navigate({ pathname: routes.home.path });
      }
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
        transform: isShow ? "" : "translateY(-125%)",
        opacity: isShow ? "1" : "0",
        zIndex: isShow ? 50 : 0,
      }}
      className="absolute w-3/4 min-w-[480px] max-w-[600px] flex flex-col justify-center gap-2 duration-500 ease-in-out transform-gpu"
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
      <div className="pt-2 flex justify-between items-center">
        <div className="flex flex-col">
          <Text size="sm" font="light">
            Need an account?
          </Text>
          <Text
            size="sm"
            font="default"
            onClick={() => {
              reset(), switchForm.toRegister();
            }}
            underline
            className="cursor-pointer"
          >
            Sign-up
          </Text>
        </div>
        <Button
          title="Sign-in"
          size="md"
          onClick={run}
          disabled={!isShow || isLoading}
        >
          <IconKey className="text-slate-500" strokeWidth="1.5" size={24} />
          <Text size="md" font="light">
            Sign-in
          </Text>
        </Button>
      </div>
    </Paper>
  );
}

function useCode({ email }: { email: string }) {
  const query = useQueryCode();
  const navigate = useNavigate();
  const notify = useNotify();

  const defaultForm = {
    value: "",
    error: "",
  };

  const [code, setCode] = useState(defaultForm);

  const reset = () => {
    setCode(defaultForm);
  };

  const schemaValidator = () => {
    if (!codeSchema.safeParse(code.value).success) {
      setCode((prevCode) => ({
        ...prevCode,
        error: `The verification code must be ${env.codeLength} characters long`,
      }));
      return false;
    }
    return true;
  };

  const run = async () => {
    const validation = schemaValidator();
    if (!validation) return;

    const { success, data } = await query.run({ code: code.value, email });

    if (!query.isLoading) {
      if (!success || !data.success) notify.show.error(message.badCode);
      if (success && data.success) navigate({ pathname: routes.home.path });
    }
  };

  return {
    code,
    setCode: (value: string) => {
      setCode((prevCode) => ({ ...prevCode, value }));
    },
    run,
    reset,
    isLoading: query.isLoading,
  };
}

function CodeForm({
  isShow,
  email,
  switchForm,
}: {
  isShow: boolean;
  email: string;
  switchForm: {
    toLogin: () => void;
    toRegister: () => void;
  };
}) {
  const { code, setCode, run, reset, isLoading } = useCode({ email });

  return (
    <Paper
      rounded="lg"
      shadow="xl"
      padding={4}
      style={{
        transform: isShow ? "" : "translateY(125%)",
        opacity: isShow ? "1" : "0",
        zIndex: isShow ? 50 : 0,
      }}
      className="absolute w-3/4 min-w-[480px] max-w-[600px] flex flex-col justify-center gap-2 duration-500 transform-gpu"
    >
      <div className="flex justify-between items-center">
        <Text size="xl" font="light" letterSpacing>
          Almost done
        </Text>
        {isLoading && <Spinner size={32} />}
      </div>
      <Text size="sm" font="light" className="text-justify">
        Please enter the verification code sent to your telescope account{" "}
        <b className="text-green-600">{email}</b> on another device:
      </Text>
      <InputField
        label="Code"
        sensitive
        size="md"
        disabled={!isShow || isLoading}
        value={code.value}
        setValue={setCode}
        error={code.error}
      />
      <div className="pt-2 flex justify-between items-center">
        <div className="flex flex-col items-start">
          <Text size="sm" font="light">
            Not your account?
          </Text>
          <Text
            size="sm"
            font="default"
            onClick={() => {
              reset(), switchForm.toLogin();
            }}
            underline
            className="cursor-pointer"
          >
            Return to login
          </Text>
        </div>
        <Button
          title="Send code"
          size="md"
          onClick={run}
          disabled={!isShow || isLoading}
        >
          <IconSend2 className="text-slate-500" strokeWidth="1.5" size={24} />
          <Text size="md" font="light">
            Proceed
          </Text>
        </Button>
      </div>
    </Paper>
  );
}

function useRegister({
  switchForm,
}: {
  switchForm: {
    toLogin: () => void;
    toRegister: () => void;
  };
}) {
  const query = useQueryRegister();
  const navigate = useNavigate();
  const notify = useNotify();

  const defaultForm = {
    email: { value: "", error: "" },
    username: { value: "", error: "" },
    password: { value: "", error: "" },
  };

  const [form, setForm] = useState(defaultForm);
  const setEmail = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, email: { value, error: "" } }));
  };
  const setUsername = (value: string) => {
    setForm((prevForm) => ({ ...prevForm, username: { value, error: "" } }));
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
    const username = usernameSchema.safeParse(form.password.value);
    if (!username.success) {
      setForm((prevForm) => ({
        ...prevForm,
        username: {
          ...prevForm.username,
          error: `Must be at least ${env.usernameRange.min} and no more than ${env.usernameRange.max} characters`,
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
    if (!email.success || !password.success || !username.success) return false;
    return true;
  };

  const run = async () => {
    const validation = schemaValidator();
    if (!validation) return;

    const { success, data } = await query.run({
      email: form.email.value,
      password: form.password.value,
      username: form.username.value,
    });
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

  return {
    form,
    setEmail,
    setUsername,
    setPassword,
    run,
    reset,
    isLoading: query.isLoading,
  };
}

function RegisterForm({
  isShow,
  switchForm,
}: {
  isShow: boolean;
  switchForm: {
    toLogin: () => void;
    toRegister: () => void;
  };
}) {
  const { form, setEmail, setUsername, setPassword, run, reset, isLoading } =
    useRegister({ switchForm });

  return (
    <Paper
      rounded="lg"
      shadow="xl"
      padding={4}
      style={{
        transform: isShow ? "" : "translateY(125%)",
        opacity: isShow ? "1" : "0",
        zIndex: isShow ? 50 : 0,
      }}
      className="absolute w-3/4 min-w-[480px] max-w-[600px] flex flex-col justify-center gap-2 duration-500 transform-gpu"
    >
      <div className="flex justify-between items-center">
        <Text size="xl" font="light" letterSpacing>
          Create an account
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
        label="Username"
        size="md"
        disabled={!isShow || isLoading}
        value={form.username.value}
        setValue={setUsername}
        error={form.username.error}
        rightSection={
          <IconUser size={28} className="text-slate-500" strokeWidth="1" />
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
      <div className="pt-2 flex justify-between items-center">
        <div className="flex flex-col items-start">
          <Text size="sm" font="light">
            Need to log in?
          </Text>
          <Text
            size="sm"
            font="default"
            onClick={() => {
              reset(), switchForm.toLogin();
            }}
            underline
            className="cursor-pointer"
          >
            Sign-in
          </Text>
        </div>
        <Button
          title="Sign-up"
          size="md"
          onClick={run}
          disabled={!isShow || isLoading}
        >
          <IconKey className="text-slate-500" strokeWidth="1.5" size={24} />
          <Text size="md" font="light">
            Sign-up
          </Text>
        </Button>
      </div>
    </Paper>
  );
}
