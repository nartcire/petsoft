"use client";

import { logIn, signUp } from "@/actions/actions";

import AuthFormBtn from "./auth-form-btn";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFormState } from "react-dom";

type AuthFormProps = {
  type: "signUp" | "logIn";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [signUpError, dispatchSignUp] = useFormState(signUp, undefined);

  return (
    <form action={type === "logIn" ? logIn : dispatchSignUp}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required maxLength={100} />
      </div>
      <div className="space-y-1 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          maxLength={100}
        />
      </div>
      <AuthFormBtn type={type} />

      {signUpError && (
        <p className="text-red-500 text-sm mt-2">{signUpError.message}</p>
      )}
    </form>
  );
}
