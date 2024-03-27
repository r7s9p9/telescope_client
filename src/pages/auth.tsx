import { ReactNode } from "react";
import { AuthContainer } from "../widgets/auth-container/auth-container";
import { NotifyStack } from "../widgets/notification/notification";

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
    <div className="w-screen h-screen flex justify-center items-center bg-slate-200">
      <div className="w-full h-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
