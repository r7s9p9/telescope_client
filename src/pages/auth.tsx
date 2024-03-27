import { ReactNode } from "react";
import { AuthContainer } from "../widgets/auth-container/auth-container";
import { NotifyStack } from "../widgets/notification/notification";

export default function Auth({ type }: { type: "login" | "register" }) {
  return (
    <Background>
      <NotifyStack />
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
    <div className=" flex flex-col bg-slate-400 w-2/3 min-w-fit max-w-2xl h-1/2 min-h-fit p-1 rounded-xl border-2 border-slate-600 shadow-xl">
      <p className="text-lg w-full text-center font-light tracking-widest uppercase select-none">
        Telescope
      </p>
      <div className="flex justify-center items-center border-t-2 border-slate-500 bg-gray-100 w-full h-full mt-1 rounded-b-xl">
        {children}
      </div>
    </div>
  );
}
