import { request } from "https";
import {
  AUTH_FAILED_ERROR_TYPE,
  CONTENT_TYPE_NOT_VALID_ERROR_TYPE
} from "./constants/error-types";
import { WAVECELL_DOMAIN_BASE } from "./constants/wavecell-api-urls";
import getAuthorizationHeader from "./utils/get-authorization-header";
import getErrorFromRawResponse from "./utils/get-error-from-raw-response";

/**
 * Validate otp code.
 *
 * @name otpCodeVerify
 * @param {string} otp - Otp code received via sms. Pass empty otp code to get current status of authentication object.
 * @param {string} resourceUri - Uri for validating otp. Can be found in otpCodeSend response.
 * @param {{ accountId: string, apiKey: string, password: string }} accountConfig - Wavecell account configuration.
 *
 * @return {Promise<object>} - Wavecell API json response. https://developer.wavecell.com/v1/api-documentation/verify-code-validation#response
 */
function otpCodeVerify(otp, resourceUri, accountConfig) {
  if (!accountConfig) {
    const error = new Error("Missing auth credentials.");
    error.type = AUTH_FAILED_ERROR_TYPE;
    return Promise.reject(error);
  }
  const authHeader = getAuthorizationHeader(accountConfig);
  if (!authHeader) {
    const error = new Error("Missing auth credentials.");
    error.type = AUTH_FAILED_ERROR_TYPE;
    return Promise.reject(error);
  }
  return new Promise((resolve, reject) => {
    const req = request(
      {
        headers: {
          Authorization: authHeader
        },
        hostname: WAVECELL_DOMAIN_BASE,
        method: "GET",
        path: otp ? `${resourceUri}?code=${otp}` : resourceUri
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
    req.end();
  });
}

export default otpCodeVerify;
