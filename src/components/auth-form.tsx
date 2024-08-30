import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { logIn } from "@/actions/actions";

type AuthFormProps = {
  type: "signUp" | "logIn";
};

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form action={logIn}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </div>
      <div className="space-y-1 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>
      <Button className="mt-4">
        {type === "logIn" ? "Log in" : "Sign up"}
      </Button>
    </form>
  );
}
