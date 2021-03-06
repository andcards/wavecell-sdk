import {
  AUTH_FAILED_ERROR_TYPE,
  DESTINATION_NOT_VALID_ERROR_TYPE,
  REQUEST_FAILED_ERROR_TYPE,
  OBJECT_NOT_FOUND_ERROR_TYPE,
  RE_SENDING_NOT_ALLOWED_ERROR_TYPE
} from "../constants/error-types";

export default function getErrorFromRawResponse(json, statusCode) {
  switch (json.code) {
    case 1001: {
      const error = new Error("SubAccountId is not valid.");
      error.type = AUTH_FAILED_ERROR_TYPE;
      error.statusCode = statusCode;
      error.rawResponse = json;
      return error;
    }
    case 1002: {
      const error = new Error("Invalid MSISDN (not mobile phone number).");
      error.type = DESTINATION_NOT_VALID_ERROR_TYPE;
      error.statusCode = statusCode;
      error.rawResponse = json;
      return error;
    }
    case 1200: {
      const error = new Error("Request was not authenticated properly.");
      error.type = AUTH_FAILED_ERROR_TYPE;
      error.statusCode = statusCode;
      error.rawResponse = json;
      return error;
    }
    case 1300: {
      const error = new Error("Object was not found or is already expired.");
      error.type = OBJECT_NOT_FOUND_ERROR_TYPE;
      error.statusCode = statusCode;
      error.rawResponse = json;
      return error;
    }
    case 1400: {
      const error = new Error(
        "Re-sending to the same destination is not allowed."
      );
      error.type = RE_SENDING_NOT_ALLOWED_ERROR_TYPE;
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
