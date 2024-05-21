import { ReactNode } from "react";
import { AuthContainer } from "../widgets/AuthContainer/AuthContainer";
import { NotifyStack } from "../widgets/Notification/Notification";

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
