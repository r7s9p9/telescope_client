import { IconFilePlus, IconKey, IconLogin } from "@tabler/icons-react";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useFetcher } from "react-router-dom";

export default function Welcome() {
  return (
    <Background>
      <Window>
        <Auth />
      </Window>
    </Background>
  );
}

function Background({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-400">
      <div className="absolute mix-blend-overlay blur w-5/6 h-5/6">
        <BackgroundWindow>
          <BackgroundWindow />
        </BackgroundWindow>
      </div>
      <div className="z-10 w-full h-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}

function BackgroundWindow({ children }: { children?: ReactNode }) {
  return (
    <div className="mix-blend-overlay w-full min-h-80 min-w-80 h-full border-4 rounded-xl border-slate-600 bg-slate-400">
      <div className="flex items-center h-6 w-full bg-slate-500"></div>
      <div className="flex w-full h-full pt-16 pb-24 px-48 justify-center items-center">
        {children}
      </div>
    </div>
  );
}

function Window({ children }: { children: ReactNode }) {
  return (
    <div className=" flex flex-col bg-slate-400 w-2/5 min-w-96 h-2/5 min-h-96 p-1 rounded-xl border-2 border-slate-600 shadow-xl">
      <div className="flex flex-row items-center ">
        <div className="absolute flex flex-row justify-between w-16 mx-2 h-4">
          <button className="rounded-full border-2 border-slate-500 hover:border-0 hover:bg-red-500 w-4"></button>
          <button className="rounded-full border-2 border-slate-500 hover:border-0 hover:bg-yellow-500 w-4"></button>
          <button className="rounded-full border-2 border-slate-500 hover:border-0 hover:bg-green-500 w-4"></button>
        </div>
        <p className="text-lg w-full text-center font-light tracking-widest uppercase select-none">
          📡 Telescope 📡
        </p>
      </div>
      <div className="flex justify-center items-center border-t-2 border-slate-500 bg-gray-100 w-full h-full mt-1 rounded-b-xl">
        {children}
      </div>
    </div>
  );
}

interface RegisterState {
  isRegister: boolean;
  setRegister: Dispatch<SetStateAction<boolean>>;
}

function Auth() {
  const [isRegister, setRegister] = useState(false);
  return (
    <div className="overflow-hidden flex flex-row items-center w-full h-full select-none">
      <LoginForm isRegister={isRegister} setRegister={setRegister} />
      <RegisterForm isRegister={isRegister} setRegister={setRegister} />
    </div>
  );
}

function LoginForm({ isRegister, setRegister }: RegisterState) {
  const fetcher = useFetcher();

  function handleClick() {
    if (!isRegister) setRegister(true);
  }

  return (
    <fetcher.Form
      method="post"
      action="/room/:roomId/message/add"
      style={{
        transform: !isRegister ? `translateX(50%)` : `translateX(-125%) `,
        opacity: !isRegister ? "1" : "0",
      }}
      className="h-full w-full flex flex-col justify-center gap-2 items-center duration-500"
    >
      <div className="w-full flex flex-col text-center font-light">
        <p className="text-xl">Welcome back!</p>
        <p>✨ We are so glad to see you again! ✨</p>
      </div>
      <div className="w-full">
        <p className="uppercase text-sm">Email</p>
        <input
          className="w-full outline-none required:border-red-500 bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:ring-slate-700 focus:border-slate-700"
          type="email"
          name="email"
        ></input>
      </div>
      <div className="w-full">
        <p className="uppercase text-sm">Password</p>
        <input
          className="w-full outline-none bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:ring-slate-700 focus:border-slate-700"
          type="password"
          name="password"
        ></input>
      </div>
      <div className="w-full outline-none flex flex-row justify-between items-end">
        <div className="flex flex-col items-start">
          <p className="text-sm font-light">Need an account?</p>
          <button
            onClick={() => handleClick()}
            className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
          >
            <IconFilePlus className="text-slate-600" size={24} />
            Sign-up
          </button>
        </div>
        <button
          type="submit"
          className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
        >
          <IconKey className="text-slate-600" size={24} />
          Login
        </button>
      </div>
    </fetcher.Form>
  );
}

function RegisterForm({ isRegister, setRegister }: RegisterState) {
  const fetcher = useFetcher();

  function handleClick() {
    if (isRegister) setRegister(false);
  }

  return (
    <fetcher.Form
      method="post"
      action="/room/:roomId/message/add"
      style={{
        transform: isRegister ? `translateX(-50%)` : `translateX(125%)`,
        opacity: isRegister ? "1" : "0",
      }}
      className="h-full w-full flex flex-col justify-center gap-2 items-center duration-500"
    >
      <p className="w-full text-center font-light text-xl">Create an account</p>
      <div className="w-full">
        <p className="uppercase text-sm">Email</p>
        <input
          className="w-full outline-none required:border-red-500 bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:ring-slate-700 focus:border-slate-700"
          type="email"
          name="email"
        ></input>
      </div>
      <div className="w-full">
        <p className="uppercase text-sm">Username</p>
        <input
          className="w-full outline-none required:border-red-500 bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:ring-slate-700 focus:border-slate-700"
          type="username"
          name="username"
        ></input>
      </div>
      <div className="w-full">
        <p className="uppercase text-sm">Password</p>
        <input
          className="w-full outline-none bg-slate-100 border-2 border-slate-400 p-1 rounded-md focus:ring-slate-700 focus:border-slate-700"
          type="password"
          name="password"
        ></input>
      </div>
      <div className="outline-none flex flex-row w-full justify-between items-end py-2">
        <div className="flex flex-col items-start">
          <p className="text-sm font-light">Need to log in?</p>
          <button
            onClick={() => handleClick()}
            className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
          >
            <IconLogin className="text-slate-600" size={24} />
            Sign-in
          </button>
        </div>
        <button
          type="submit"
          className="flex justify-center items-center gap-2 p-2 w-32 rounded-md border-2 border-slate-400 hover:bg-slate-200"
        >
          <IconKey className="text-slate-600" size={24} />
          Register
        </button>
      </div>
    </fetcher.Form>
  );
}
