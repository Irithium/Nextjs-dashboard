"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: { [key: string]: string } = {
    invalid_credentials: "Invalid username or password.",
    email_not_verified: "Your email is not verified.",
    default: "An unexpected error occurred. Please try again.",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-500">Authentication Error</h1>
      <p className="mt-4 text-lg text-gray-700">
        {errorMessages[error as string] || errorMessages.default}
      </p>
      <a
        href="/auth/signin"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go back to Sign In
      </a>
    </div>
  );
}
