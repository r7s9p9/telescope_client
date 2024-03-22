import {
  IconArrowBack,
  IconComet,
  IconKey,
  IconLogin,
  IconMail,
  IconPassword,
  IconSend,
  IconSend2,
  IconUser,
} from "@tabler/icons-react";
import { Dispatch, ReactNode, useEffect, useState } from "react";
import { useFetcher, useLocation, useNavigate } from "react-router-dom";

interface ShowItemState {
  showItem: "login" | "register" | "code";
  setShowItem: Dispatch<ShowItemState["showItem"]>;
}

interface EmailState {
  email: string;
  setEmail: Dispatch<EmailState["email"]>;
}

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
  const [email, setEmail] = useState<EmailState["email"]>("");

  return (
    <div className="overflow-hidden relative flex flex-row justify-center items-center w-full h-full select-none">
      <LoginForm
        showItem={showItem}
        setShowItem={setShowItem}
        email={email}
        setEmail={setEmail}
      />
      <CodeForm
        showItem={showItem}
        setShowItem={setShowItem}
        email={email}
        setEmail={setEmail}
      />
      <RegisterForm showItem={showItem} setShowItem={setShowItem} />
    </div>
  );
}

function InputEmail({ isDisabled }: { isDisabled: boolean }) {
  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap flex-row justify-between items-center">
        <p className="uppercase text-sm">Email</p>
      </div>
      <div className="flex items-center justify-end">
        <input
          className="w-full outline-none invalid:focus:border-red-600 valid:border-green-600 bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:bg-slate-200 focus:border-slate-700"
          type="email"
          name="email"
          required
          spellCheck={false}
          multiple={false}
          disabled={isDisabled}
        />
        <IconMail size={24} className="absolute m-2 text-slate-400" />
      </div>
    </div>
  );
}

function InputUsername({ isDisabled }: { isDisabled: boolean }) {
  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap flex-row justify-between items-center">
        <p className="uppercase text-sm">Username</p>
      </div>
      <div className="flex items-center justify-end">
        <input
          className="w-full outline-none invalid:focus:border-red-600 valid:border-green-600 bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:bg-slate-200 focus:border-slate-700"
          type="username"
          name="username"
          required
          spellCheck={false}
          minLength={4}
          maxLength={16}
          pattern="[a-zA-Z0-9]+"
          disabled={isDisabled}
        />
        <IconUser size={24} className="absolute m-2 text-slate-400" />
      </div>
    </div>
  );
}

function InputPassword({ isDisabled }: { isDisabled: boolean }) {
  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap flex-row justify-between items-center">
        <p className="uppercase text-sm">Password</p>
      </div>
      <div className="flex items-center justify-end">
        <input
          className="w-full outline-none invalid:focus:border-red-600 valid:border-green-600 bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:bg-slate-200 focus:border-slate-700"
          type="password"
          name="password"
          required
          spellCheck={false}
          minLength={4}
          maxLength={16}
          pattern="[a-zA-Z0-9]+"
          disabled={isDisabled}
        />
        <IconPassword size={24} className="absolute m-2 text-slate-400" />
      </div>
    </div>
  );
}

function InputCode({ isDisabled }: { isDisabled: boolean }) {
  return (
    <div className="flex items-center justify-end">
      <input
        className="w-full text-center outline-none invalid:focus:border-red-600 valid:border-green-600 bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:bg-slate-200 focus:border-slate-700"
        type="password"
        name="code"
        required
        spellCheck={false}
        minLength={6}
        maxLength={6}
        disabled={isDisabled}
        pattern="[0-9]+"
      />
      <IconPassword size={24} className="absolute m-2 text-slate-400" />
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
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}

function ButtonCancel({
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
      onClick={() => handleClick()}
      type="button"
      className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}

function CodeForm({
  showItem,
  setShowItem,
  email,
  setEmail,
}: ShowItemState & EmailState) {
  const isShow = showItem === "code";

  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (isShow && fetcher.data?.success) {
      navigate("/");
    }
    if (isShow && !fetcher.data?.success) {
      console.log("no success");
    }
  }, [fetcher]);

  function handleClick() {
    setEmail("");
    setShowItem("login");
    navigate("/login");
  }

  return (
    <div
      className="absolute self-center w-4/5 min-w-80 h-4/5 min-h-48 flex justify-center items-center bg-gray-100 rounded-b-xl duration-500"
      style={{
        transform: isShow ? `translateY(0%)` : `translateY(-150%)`,
      }}
    >
      <fetcher.Form
        method="post"
        action="/login/code"
        className="flex flex-col p-4 w-full h-full border-2 border-slate-300 shadow-xl justify-between rounded-xl gap-2 items-center"
      >
        <div>
          <p className="text-2xl text-center">Almost done...</p>
          <p className="text-sm text-center">
            Please enter the confirmation code sent to the telescope on your
            other device:
          </p>
        </div>
        <input type="hidden" name="email" value={email} />
        <InputCode isDisabled={!isShow} />
        <div className="w-full flex justify-between">
          <ButtonCancel isDisabled={!isShow} handleClick={handleClick}>
            <IconArrowBack className="text-slate-600" size={24} />
            Cancel
          </ButtonCancel>
          <ButtonSubmit isDisabled={!isShow}>
            <IconSend2 className="text-slate-600" size={18} />
            Send
          </ButtonSubmit>
        </div>
      </fetcher.Form>
    </div>
  );
}

function LoginForm({
  showItem,
  setShowItem,
  email,
  setEmail,
}: ShowItemState & EmailState) {
  const isShow = showItem === "login";
  const isCode = showItem === "code";

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(fetcher.data);

  useEffect(() => {
    if (location.pathname === "/login/code" && !isCode) {
      navigate("/login");
    }
  }, [location]);

  useEffect(() => {
    if (fetcher.data?.success && isShow) {
      if (fetcher.data?.isCodeNeeded) {
        // Bug -> fetcher.data keep info -> if (true) after Cancel button in CodeForm
        setEmail(fetcher.data.email);
        setShowItem("code");
        navigate("/login/code");
      }
      if (!fetcher.data?.isCodeNeeded) {
        navigate("/");
      }
    }
  }, [fetcher]);

  function handleClick() {
    setShowItem("register");
    navigate("/register");
  }

  return (
    <fetcher.Form
      method="post"
      action="/login"
      style={{
        transform:
          isShow || isCode
            ? `translateX(50%) scale(1)`
            : `translateX(-150%) scale(0.75)`,
        opacity: isShow || isCode ? "1" : "0",
        filter: isCode ? `blur(4px)` : `blur(0px)`,
      }}
      className="h-full w-full flex flex-col justify-center gap-2 items-center duration-500"
    >
      <p className="text-center text-2xl">Welcome back!</p>
      <InputEmail isDisabled={!isShow} />
      <InputPassword isDisabled={!isShow} />
      <div className="w-full outline-none flex flex-row justify-between items-end">
        <div className="flex flex-col items-start">
          <p className="text-sm font-light">Need an account?</p>
          <button
            type="button"
            onClick={() => handleClick()}
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
    </fetcher.Form>
  );
}

function RegisterForm({ showItem, setShowItem }: ShowItemState) {
  const isShow = showItem === "register";
  const isCode = showItem === "code";

  const fetcher = useFetcher();
  const navigate = useNavigate();

  function handleClick() {
    setShowItem("login");
    navigate("/login");
  }

  return (
    <fetcher.Form
      method="post"
      action="/register"
      style={{
        transform: isShow
          ? `translateX(-50%) scale(1)`
          : `translateX(150%) scale(0.75)`,
        opacity: isShow ? "1" : "0",
        filter: isCode ? `blur(4px)` : `blur(0px)`,
      }}
      className="h-full w-full flex flex-col justify-center gap-2 duration-500"
    >
      <p className="w-full text-center text-2xl">Create an account</p>
      <InputEmail isDisabled={!isShow} />
      <InputUsername isDisabled={!isShow} />
      <InputPassword isDisabled={!isShow} />
      <div className="outline-none flex flex-row w-full justify-between items-end py-2">
        <div className="flex flex-col items-start">
          <p className="text-sm font-light">Need to log in?</p>
          <button
            type="button"
            onClick={() => handleClick()}
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
    </fetcher.Form>
  );
}
