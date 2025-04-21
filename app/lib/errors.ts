import { AuthError } from "next-auth";

export class InvalidLoginError extends AuthError {
  code = "invalid_credentials";

  constructor(message: string) {
    super(message);
    this.code = message;
  }
}
