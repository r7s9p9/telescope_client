import { ReactNode } from "react";
import { NotifyStack } from "../Notification/Notification";
import { IconKey, IconMail, IconSend2, IconUser } from "@tabler/icons-react";
import { Spinner } from "../../shared/ui/Spinner/Spinner";
import { Text } from "../../shared/ui/Text/Text";
import { Paper } from "../../shared/ui/Paper/Paper";
import { InputField } from "../../shared/ui/InputField/InputField";
import { Button } from "../../shared/ui/Button/Button";
import { useCode, useLogin, useMain, useRegister } from "./useAuth";

export default function Auth({ type }: { type: "login" | "register" }) {
  return (
    <Background>
      <NotifyStack />
      <AuthContainer type={type} />
    </Background>
  );
}

function Background({ children }: { children: ReactNode }) {
  return <div className="w-screen h-screen bg-slate-300">{children}</div>;
}

function AuthContainer({ type }: { type: "login" | "register" }) {
  const { showItem, switchForm, handleCodeRequired, email } = useMain({ type });

  return (
    <div className="overflow-hidden relative w-full h-full flex flex-row items-end md:justify-center md:items-center select-none">
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
      padding={4}
      style={{
        transform: isShow ? "" : "translateX(-125%)",
        opacity: isShow ? "1" : "0",
        zIndex: isShow ? 50 : 0,
      }}
      className="absolute w-full md:w-3/4 md:max-w-xl md:shadow-xl flex flex-col justify-center gap-2 rounded-t-xl md:rounded-xl duration-500 ease-in-out transform-gpu"
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
      padding={4}
      style={{
        transform: isShow ? "" : "translateX(125%)",
        opacity: isShow ? "1" : "0",
        zIndex: isShow ? 50 : 0,
      }}
      className="absolute w-full md:w-3/4 md:max-w-xl md:shadow-xl flex flex-col justify-center gap-2 rounded-t-xl md:rounded-xl duration-500 ease-in-out transform-gpu"
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
      padding={4}
      style={{
        transform: isShow ? "" : "translateX(125%)",
        opacity: isShow ? "1" : "0",
        zIndex: isShow ? 50 : 0,
      }}
      className="absolute w-full md:w-3/4 md:max-w-xl md:shadow-xl flex flex-col justify-center gap-2 rounded-t-xl md:rounded-xl duration-500 ease-in-out transform-gpu"
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
