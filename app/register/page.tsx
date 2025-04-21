import AcmeLogo from "@/app/ui/acme-logo";
import { Suspense } from "react";

import RegisterForm from "../ui/register-form";

export default async function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen md:h-full h-full bg-gradient-to-br from-blue-400 to-blue-200">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-24">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
