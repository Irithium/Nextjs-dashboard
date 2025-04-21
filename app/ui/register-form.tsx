import CredentialRegister from "./credential-register";
import GoogleSignIn from "./google-button";
import Link from "next/link";

const RegisterForm = () => {
  return (
    <div className="flex-1 rounded-lg bg-gray-50 px-6 pt-6 pb-3 ">
      <CredentialRegister />
      <GoogleSignIn />
      <p className="text-sm text-center mt-4 pt-3 pb-1 border-t border-gray-300">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500">
          Log in here
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
