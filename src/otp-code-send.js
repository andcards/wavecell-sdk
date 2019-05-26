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
  resendingInterval: 15
};

/**
 * Send otp code to phone number.
 * @name otpCodeSend
 * @param {string} phoneNumber - Destination phone number.
 * @param {{ source: string, text: string, encoding?: string }} smsTemplate - configuration of SMS template.
 * @param {{ accountId: string, password: string, apiKey: string, subAccountId: string }} accountConfig - Wavecell account configuration.
 * @param {{ codeLength?: number, codeType?: string, codeValidity?: number, createNew?: boolean, resendingInterval?: number, productName?: string }} options - Additional configuration for code generation.
 *
 * @return {Promise<object>} - Wavecell API json response. https://developer.wavecell.com/v1/api-documentation/verify-code-generation#response
 */
function otpCodeSend(
  phoneNumber,
  smsTemplate,
  accountConfig,
  options = DEFAULT_OPTIONS
) {
  if (!accountConfig) {
    const error = new Error("Missing auth credentials.");
    error.type = AUTH_FAILED_ERROR_TYPE;
    return Promise.reject(error);
  }
  const { subAccountId } = accountConfig;
  const authHeader = getAuthorizationHeader(accountConfig);
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
  if (!phoneNumber) {
    const error = new Error("Missing phone number.");
    error.type = DESTINATION_NOT_VALID_ERROR_TYPE;
    return Promise.reject(error);
  }
  if (!smsTemplate) {
    const error = new Error("Missing smsTemplate.");
    error.type = SMS_TEMPLATE_NOT_VALID_ERROR_TYPE;
    return Promise.reject(error);
  }
  if (!smsTemplate.source) {
    const error = new Error("Missing smsTemplate source.");
    error.type = SMS_TEMPLATE_NOT_VALID_ERROR_TYPE;
    return Promise.reject(error);
  }
  if (!smsTemplate.text) {
    const error = new Error("Missing smsTemplate text.");
    error.type = SMS_TEMPLATE_NOT_VALID_ERROR_TYPE;
    return Promise.reject(error);
  }
  const {
    codeLength,
    codeType,
    codeValidity,
    createNew,
    productName,
    resendingInterval
  } = options || DEFAULT_OPTIONS;
  const body = {
    codeLength,
    codeType,
    codeValidity,
    createNew,
    destination: phoneNumber,
    productName,
    resendingInterval,
    template: smsTemplate
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
