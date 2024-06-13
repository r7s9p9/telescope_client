import { Dispatch, ReactNode } from "react";
import { NotifyStack } from "../Notification/Notification";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconKey, IconMail, IconSend2, IconUser } from "@tabler/icons-react";
import {
  useQueryCode,
  useQueryLogin,
  useQueryRegister,
} from "../../shared/api/api.model";
import { routes } from "../../constants";
import { useNotify } from "../Notification/Notification";
import { Spinner } from "../../shared/ui/Spinner/Spinner";
import { Text } from "../../shared/ui/Text/Text";
import { Paper } from "../../shared/ui/Paper/Paper";
import { InputField } from "../../shared/ui/InputField/InputField";
import { Button } from "../../shared/ui/Button/Button";
import { langAuth, langError } from "../../locales/en";

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
      notify.show.info(langAuth.LOGGED_OUT);
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

  const run = async () => {
    const { success, response, requestError, responseError } = await query.run({
      email: form.email.value,
      password: form.password.value,
    });

    if (!success && requestError) {
      setForm((prevForm) => ({
        ...prevForm,
        email: {
          ...prevForm.email,
          error: requestError.email || "",
        },
        password: {
          ...prevForm.password,
          error: requestError.password || "",
        },
      }));
      return;
    }

    if (!success && responseError) {
      notify.show.error(responseError);
      return;
    }

    if (!success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
      return;
    }

    if (response?.success) {
      if (response.code) {
        handleCodeRequired(form.email.value);
      } else {
        navigate({ pathname: routes.home.path });
      }
    } else {
      notify.show.error(langAuth.INCORRECT_CREDENTIALS);
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

  const run = async () => {
    const { success, response, requestError, responseError } = await query.run({
      code: code.value,
      email,
    });

    if (!success && requestError) {
      setCode((prevCode) => ({
        ...prevCode,
        error: requestError.code || "",
      }));
      if (requestError.email) {
        notify.show.error(langAuth.OUTDATED_EMAIL);
        navigate({ pathname: routes.login.path });
        return;
      }
    }

    if (!success && responseError) {
      notify.show.error(responseError);
      return;
    }

    if (!success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
      return;
    }

    if (!response.success) notify.show.error(langAuth.BAD_CODE);
    if (response.success) navigate({ pathname: routes.home.path });
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

  const run = async () => {
    const { success, response, requestError, responseError } = await query.run({
      email: form.email.value,
      password: form.password.value,
      username: form.username.value,
    });

    if (!success && requestError) {
      setForm((prevForm) => ({
        ...prevForm,
        email: {
          ...prevForm.email,
          error: requestError.email || "",
        },
        username: {
          ...prevForm.username,
          error: requestError.username || "",
        },
        password: {
          ...prevForm.password,
          error: requestError.password || "",
        },
      }));
      return;
    }

    if (!success && responseError) {
      notify.show.error(responseError);
      return;
    }

    if (!success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
      return;
    }

    if (!response.success) {
      switch (response.errorCode) {
        case "EMAIL_ALREADY_EXISTS":
          notify.show.error(langAuth.EMAIL_EXISTS);
          break;
        case "USERNAME_ALREADY_EXISTS":
          notify.show.error(langAuth.USERNAME_EXISTS);
          break;
        default:
          notify.show.error(langError.RESPONSE_COMMON_MESSAGE);
          break;
      }
    } else {
      notify.show.info(langAuth.REGISTER_SUCCESS);
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
