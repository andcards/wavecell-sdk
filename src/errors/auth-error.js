import { AUTH_ERROR_TYPE } from "../constants/error-types";

class AuthError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, AuthError);
    this.type = AUTH_ERROR_TYPE;
  }
}

export default AuthError;
