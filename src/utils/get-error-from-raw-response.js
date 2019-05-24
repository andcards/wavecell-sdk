import {
  AUTH_FAILED_ERROR_TYPE,
  DESTINATION_NOT_VALID_ERROR_TYPE,
  REQUEST_FAILED_ERROR_TYPE
} from "../constants/error-types";

export default function getErrorFromRawResponse(json, statusCode) {
  switch (json.code) {
    // SubAccountId is not valid.
    case 1001: {
      const error = new Error("SubAccountId is not valid.");
      error.type = AUTH_FAILED_ERROR_TYPE;
      error.statusCode = statusCode;
      error.rawResponse = json;
      return error;
    }
    // Invalid MSDSN.
    case 1002: {
      const error = new Error("Invalid MSISDN (not mobile phone number).");
      error.type = DESTINATION_NOT_VALID_ERROR_TYPE;
      error.statusCode = statusCode;
      error.rawResponse = json;
      return error;
    }
    // Bad credentials.
    case 1200: {
      const error = new Error("Request was not authenticated properly.");
      error.type = AUTH_FAILED_ERROR_TYPE;
      error.statusCode = statusCode;
      error.rawResponse = json;
      return error;
    }
    default: {
      const error = new Error("Request failed.");
      error.type = REQUEST_FAILED_ERROR_TYPE;
      error.statusCode = statusCode;
      error.rawResponse = json;
      return error;
    }
  }
}
