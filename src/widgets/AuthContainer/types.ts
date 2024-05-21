import { Dispatch } from "react";
import { FieldErrors, Path, UseFormRegister } from "react-hook-form";

export interface ShowItemState {
    showItem: "login" | "register" | "code";
    setShowItem: Dispatch<ShowItemState["showItem"]>;
}
  
export interface EmailState {
    email: string;
    setEmail: Dispatch<EmailState["email"]>;
}
  
export interface IFormValues {
    email: string;
    password: string;
    username: string;
    code: string;
}
  
export type InputProps = {
    type: Path<IFormValues>;
    register: UseFormRegister<IFormValues>;
    required: boolean;
    isDisabled: boolean;
    errors: FieldErrors<IFormValues>;
};