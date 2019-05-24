import { request } from "https";
import { AUTH_ERROR_TYPE } from "./constants/error-types";
import { WAVECELL_DOMAIN_BASE } from "./constants/wavecell-api-urls";

const WAVECELL_INVALID_MSDSN_ERROR_CODE = 1002;

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
 * @param {{ accountId: string, password: string, subAccountId: string }} accountConfig - Wavecell account configuration.
 * @param {{ codeLength?: number, codeType?: string, codeValidity?: number, createNew?: boolean, resendingInterval?: number, productName?: string }} options - Additional configuration for code generation.
 *
 * @return {Promise<object>} - Wavecell API json response. https://developer.wavecell.com/v1/api-documentation/verify-code-generation#response
 */
function otpCodeSend(phoneNumber, smsTemplate, accountConfig, options = {}) {
  const { accountId, password, subAccountId } = accountConfig;
  if (!accountId) {
    const error = new Error("Missing accountId.");
    error.type = AUTH_ERROR_TYPE;
    return Promise.reject(error);
  }
  if (!password) {
    const error = new Error("Missing password.");
    error.type = AUTH_ERROR_TYPE;
    return Promise.reject(error);
  }
  if (!subAccountId) {
    const error = new Error("Missing subAccountId.");
    error.type = AUTH_ERROR_TYPE;
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
  const authorizationBasic = Buffer.from(`${accountId}:${password}`).toString(
    "base64"
  );
  return new Promise((resolve, reject) => {
    const req = request(
      {
        headers: {
          Authorization: `Basic ${authorizationBasic}`,
          "Content-Type": "application/json"
        },
        hostname: WAVECELL_DOMAIN_BASE,
        method: "POST",
        path: `/verify/v1/${subAccountId}`
      },
      response => {
        const contentType = response.headers["content-type"];
        if (!/^application\/json/.test(contentType)) {
          reject(new Error("Invalid response content type."));
          return;
        }
        let data = "";
        response.on("data", chunk => {
          data += chunk;
        });
        response.on("end", () => {
          const json = JSON.parse(data);
          if (response.statusCode !== 200) {
            const message =
              json.code === WAVECELL_INVALID_MSDSN_ERROR_CODE
                ? "Invalid MSISDN (not mobile phone number)."
                : "Request failed.";
            const error = new Error(message);
            error.rawResponse = json;
            reject(error);
            return;
          }
          resolve(json);
        });
      }
    );
    req.on("error", error => reject(error));
    req.write(JSON.stringify(body));
    req.end();
  });
}

export default otpCodeSend;
