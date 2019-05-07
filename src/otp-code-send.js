import { request } from "https";
import { WAVECELL_DOMAIN_BASE } from "./constants";

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
 *
 * @param {string} phoneNumber - Destination phone number.
 * @param {string} smsTemplate.source - Used as senderID.
 * @param {string} smsTemplate.text - Text of SMS body. Can be personalized with {code} and {productName} placeholders.
 * @param {string} smsTemplate.encoding - Optional. Recommended value: AUTO. Character set to use for this SMS - The possible values are AUTO - GSM7 - UCS2.
 * @param {string} accountConfig.accountId - Wavecell account id.
 * @param {string} accountConfig.password - Wavecell account password.
 * @param {string} accountConfig.subAccountId - Wavecell sub account id.
 * @param {number} options.codeLength - Optional. Length of sended code. Default 4.
 * @param {string} options.codeType - Optional. Type of sended code. Default "NUMERIC".
 * @param {number} options.codeValidity - Optional. Number of seconds code will be valid.
 * @param {boolean} options.createNew - Optional. Flag to force create new code each time. Default true.
 * @param {number} options.resendingInterval - Optional. Number of seconds between requests to the same phone number. default 15.
 * @param {number} options.productName - Optional. Product name which can be displayed in sms text.
 *
 * @return {Promise<object>} - Wavecell API json response. https://developer.wavecell.com/v1/api-documentation/verify-code-generation#response
 */
export default (phoneNumber, smsTemplate, accountConfig, options = {}) => {
  const { accountId, password, subAccountId } = accountConfig;
  if (!accountId) {
    return Promise.reject(new Error("Missing accountId."));
  }
  if (!password) {
    return Promise.reject(new Error("Missing password."));
  }
  if (!subAccountId) {
    return Promise.reject(new Error("Missing subAccountId."));
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
};
