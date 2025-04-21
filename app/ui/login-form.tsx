import CredentialLogin from "./credential-login";
import GoogleSignIn from "./google-button";
import Link from "next/link";

const LoginForm = () => {
  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pt-6 pb-3 ">
      <CredentialLogin />
      <GoogleSignIn />
      <p className="text-sm text-center mt-4 pt-3 pb-1 border-t border-gray-300">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-500">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
