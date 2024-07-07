import { NotifyStack } from "../../shared/features/Notification/Notification";
import { IconKey, IconMail, IconSend2, IconUser } from "@tabler/icons-react";
import { Spinner } from "../../shared/ui/Spinner/Spinner";
import { Text } from "../../shared/ui/Text/Text";
import { Paper } from "../../shared/ui/Paper/Paper";
import { InputField } from "../../shared/ui/InputField/InputField";
import { Button } from "../../shared/ui/Button/Button";
import { useCode, useLogin, useMain, useRegister } from "./useAuth";
import { langAuth } from "../../locales/en";

const inputIconProps = {
  size: 28,
  className: "text-slate-500",
  strokeWidth: "1",
};

const buttonIconProps = {
  size: 24,
  className: "text-slate-500",
  strokeWidth: "1.5",
};

export function Auth({ type }: { type: "login" | "register" }) {
  return (
    <div className="w-screen h-screen bg-slate-300">
      <NotifyStack />
      <AuthContainer type={type} />
    </div>
  );
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
          {langAuth.SIGNIN_TITLE}
        </Text>
        {isLoading && <Spinner size={32} />}
      </div>
      <InputField
        label={langAuth.EMAIL_LABEL}
        size="md"
        disabled={!isShow || isLoading}
        value={form.email.value}
        setValue={setEmail}
        error={form.email.error}
        rightSection={<IconMail {...inputIconProps} />}
      />
      <InputField
        label={langAuth.PASSWORD_LABEL}
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
            {langAuth.GO_TO_SIGN_UP_TITLE}
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
            {langAuth.GO_TO_SIGN_UP_TEXT}
          </Text>
        </div>
        <Button
          title={langAuth.SIGN_IN_ACTION}
          size="md"
          onClick={run}
          disabled={!isShow || isLoading}
        >
          <IconKey {...buttonIconProps} />
          <Text size="md" font="light">
            {langAuth.SIGN_IN_ACTION}
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
          {langAuth.CODE_TITLE}
        </Text>
        {isLoading && <Spinner size={32} />}
      </div>
      <Text size="sm" font="light" className="text-justify">
        {langAuth.CODE_MESSAGE}
        <b className="text-green-600">{email}</b>
      </Text>
      <InputField
        label={langAuth.CODE_LABEL}
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
            {langAuth.BACK_FROM_CODE_TITLE}
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
            {langAuth.BACK_FROM_CODE_TEXT}
          </Text>
        </div>
        <Button
          title={langAuth.CODE_ACTION}
          size="md"
          onClick={run}
          disabled={!isShow || isLoading}
        >
          <IconSend2 {...buttonIconProps} />
          <Text size="md" font="light">
            {langAuth.CODE_ACTION}
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
          {langAuth.SIGNUP_TITLE}
        </Text>
        {isLoading && <Spinner size={32} />}
      </div>
      <InputField
        label={langAuth.EMAIL_LABEL}
        size="md"
        disabled={!isShow || isLoading}
        value={form.email.value}
        setValue={setEmail}
        error={form.email.error}
        rightSection={<IconMail {...inputIconProps} />}
      />
      <InputField
        label={langAuth.USERNAME_LABEL}
        size="md"
        disabled={!isShow || isLoading}
        value={form.username.value}
        setValue={setUsername}
        error={form.username.error}
        rightSection={<IconUser {...inputIconProps} />}
      />
      <InputField
        label={langAuth.PASSWORD_LABEL}
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
            {langAuth.GO_TO_SIGN_IN_TITLE}
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
            {langAuth.GO_TO_SIGN_IN_TEXT}
          </Text>
        </div>
        <Button
          title={langAuth.SIGN_UP_ACTION}
          size="md"
          onClick={run}
          disabled={!isShow || isLoading}
        >
          <IconKey {...buttonIconProps} />
          <Text size="md" font="light">
            {langAuth.SIGN_UP_ACTION}
          </Text>
        </Button>
      </div>
    </Paper>
  );
}
