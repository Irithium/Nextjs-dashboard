"use client";
import { lusitana } from "@/app/ui/fonts";
import { AtSymbolIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import clsx from "clsx";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { authenticate } from "../lib/actions";

export default function CredentialRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validar los datos en el servidor
    const response = await authenticate({
      email,
      password,
      name,
      type: "register",
    });

    if (!response.success) {
      setError(response.message);
      setIsSubmitting(false);
      return;
    }

    // Llamar a signIn en el cliente
    const result = await signIn("credentials", {
      email,
      password,
      name,
      type: "register",
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/dashboard";
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className={`${lusitana.className} mb-2 text-2xl`}>
        Please register to continue.
      </h1>
      <div className="w-full">
        <div>
          <label
            className="mb-2 block text-xs font-medium text-gray-900"
            htmlFor="name"
          >
            Name
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="name"
              type="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div>
          <label
            className="mb-2 mt-3 block text-xs font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div className="">
          <label
            className="mb-2 mt-3 block text-xs font-medium text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              minLength={6}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || !email || !password || !name}
        className="mt-6 w-full  disabled:opacity-70 disabled:cursor-not-allowed"
      >
        Register <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
      {error && (
        <div
          className={clsx(
            "flex h-4 items-end space-x-1 text-sm text-red-500 text-center"
          )}
        >
          {error}
        </div>
      )}
    </form>
  );
}
