import { request } from "https";
import { WAVECELL_DOMAIN_BASE } from "./constants/wavecell-api-urls";
import AuthError from "./errors/auth-error";

/**
 * Validate otp code.
 * @name otpCodeVerify
 * @param {string} otp - Otp code received via sms.
 * @param {string} resourceUri - Uri for validating otp. Can be found in otpCodeSend response.
 * @param {{ accountId: string, password: string }} accountConfig - Wavecell account configuration.
 *
 * @return {Promise<object>} - Wavecell API json response. https://developer.wavecell.com/v1/api-documentation/verify-code-validation#response
 */
function otpCodeVerify(otp, resourceUri, accountConfig) {
  const { accountId, password } = accountConfig;
  if (!accountId) {
    return Promise.reject(new AuthError("Missing accountId."));
  }
  if (!password) {
    return Promise.reject(new AuthError("Missing password."));
  }
  const authorizationBasic = Buffer.from(`${accountId}:${password}`).toString(
    "base64"
  );
  return new Promise((resolve, reject) => {
    const req = request(
      {
        headers: {
          Authorization: `Basic ${authorizationBasic}`
        },
        hostname: WAVECELL_DOMAIN_BASE,
        method: "GET",
        path: `${resourceUri}?code=${otp}`
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
            const message = "Request failed.";
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
    req.end();
  });
}

export default otpCodeVerify;
