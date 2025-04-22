import { auth, signIn, signOut } from "@/auth";
import { Button } from "./button";
import Image from "next/image";
import googleIcon from "@/public/google-icon.svg";

export default async function GoogleSignIn() {
  const session = await auth();
  const user = session?.user;
  console.log(session);

  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirect: true, redirectTo: "/dashboard" });
      }}
      className="w-full mt-4"
    >
      <Button className="w-full" type="submit">
        <Image
          src={googleIcon}
          className=" bg-white rounded mr-2 "
          width={28}
          height={28}
          alt="Google logo"
        />{" "}
        Signin with Google
      </Button>
    </form>
  );
}
