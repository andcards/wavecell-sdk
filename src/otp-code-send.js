import { request } from "https";
import {
  AUTH_FAILED_ERROR_TYPE,
  DESTINATION_NOT_VALID_ERROR_TYPE,
  SMS_TEMPLATE_NOT_VALID_ERROR_TYPE,
  CONTENT_TYPE_NOT_VALID_ERROR_TYPE
} from "./constants/error-types";
import { WAVECELL_DOMAIN_BASE } from "./constants/wavecell-api-urls";
import getAuthorizationHeader from "./utils/get-authorization-header";
import getErrorFromRawResponse from "./utils/get-error-from-raw-response";

const DEFAULT_OPTIONS = {
  codeLength: 4,
  codeType: "NUMERIC",
  codeValidity: 300,
  createNew: true,
  resendingInterval: 15,
  smsEncoding: "AUTO"
};

/**
 * Send OTP code.
 * @name otpCodeSend
 * @param {Object} parameters - `otpCodeSend` parameters.
 * @param {string} [parameters.accountId] - Wavecell account id. Optional if apiKey is passed.
 * @param {string} [parameters.accountPassword] - Wavecell account password. Optional if apiKey is passed.
 * @param {string} parameters.apiKey - Wavecell account apiKey.
 * @param {string} parameters.destination - Phone number which receives SMS with OTP code.
 * @param {string} parameters.smsSource - SMS source.
 * @param {string} parameters.smsText - SMS template text. Can contain `{code}` placeholder, which will be replaced with generated OTP code.
 * @param {string} parameters.subAccountId - Wavecell sub account id.
 * @param {Object} [parameters.options] - Additional configurations.
 * @param {number} [parameters.options.codeLength=4] - Length of generated OTP code.
 * @param {string} [parameters.options.codeType="NUMERIC"] - Type of generated OTP code.
 * @param {number} [parameters.options.codeValidity=300] - Valid time of generated OTP code in seconds.
 * @param {boolean} [parameters.options.createNew=true] - Defines whether to create new or send the same code in case of multiple requests for the same destination.
 * @param {string} [parameters.options.productName] - Can be used to personalize content of sms template with your brand name. Will replace `{productName}` placeholder in your `smsText`.
 * @param {number} [parameters.options.resendingInterval=15] - Minimum interval in seconds allowed before a new verification request can be sent to the same destination.
 * @param {string} [parameters.options.smsEncoding="AUTO"] - Character set to use for SMS.
 *
 * @return {Promise<Object>} - Wavecell API json response. https://developer.wavecell.com/v1/api-documentation/verify-code-generation#response
 */
function otpCodeSend({
  accountId,
  accountPassword,
  apiKey,
  destination,
  options,
  smsSource,
  smsText,
  subAccountId
}) {
  const authHeader = getAuthorizationHeader({
    accountId,
    accountPassword,
    apiKey
  });
  if (!authHeader) {
    const error = new Error("Missing auth credentials.");
    error.type = AUTH_FAILED_ERROR_TYPE;
    return Promise.reject(error);
  }
  if (!subAccountId) {
    const error = new Error("Missing subAccountId.");
    error.type = AUTH_FAILED_ERROR_TYPE;
    return Promise.reject(error);
  }
  if (!destination) {
    const error = new Error("Missing phone number.");
    error.type = DESTINATION_NOT_VALID_ERROR_TYPE;
    return Promise.reject(error);
  }
  if (!smsSource) {
    const error = new Error("Missing sms source.");
    error.type = SMS_TEMPLATE_NOT_VALID_ERROR_TYPE;
    return Promise.reject(error);
  }
  if (!smsText) {
    const error = new Error("Missing sms text.");
    error.type = SMS_TEMPLATE_NOT_VALID_ERROR_TYPE;
    return Promise.reject(error);
  }
  const {
    codeLength,
    codeType,
    codeValidity,
    createNew,
    productName,
    resendingInterval,
    smsEncoding
  } = options || DEFAULT_OPTIONS;
  const body = {
    codeLength,
    codeType,
    codeValidity,
    createNew,
    destination,
    productName,
    resendingInterval,
    template: {
      source: smsSource,
      text: smsText,
      encoding: smsEncoding
    }
  };
  return new Promise((resolve, reject) => {
    const req = request(
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json"
        },
        hostname: WAVECELL_DOMAIN_BASE,
        method: "POST",
        path: `/verify/v1/${subAccountId}`
      },
      response => {
        const contentType = response.headers["content-type"];
        if (!/^application\/json/.test(contentType)) {
          const error = new Error("Response content type is not valid.");
          error.type = CONTENT_TYPE_NOT_VALID_ERROR_TYPE;
          reject(error);
          return;
        }
        let data = "";
        response.on("data", chunk => {
          data += chunk;
        });
        response.on("end", () => {
          const json = JSON.parse(data);
          if (response.statusCode !== 200) {
            reject(getErrorFromRawResponse(json, response.statusCode));
            return;
          }
          resolve(json);
        });
      }
    );
    req.on("error", reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

export default otpCodeSend;
