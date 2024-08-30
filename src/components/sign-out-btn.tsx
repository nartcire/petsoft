"use client";

import { Button } from "./ui/button";
import { logOut } from "@/actions/actions";

export default function SignOutBtn() {
  return <Button onClick={async () => logOut()}>Sign out</Button>;
}
