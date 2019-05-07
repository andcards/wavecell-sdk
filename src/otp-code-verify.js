import { request } from "https";
import { WAVECELL_DOMAIN_BASE } from "./constants";

/**
 * Validate otp code.
 *
 * @param {string} otp - Otp code received via sms.
 * @param {string} resourceUri - Uri for validating otp. Can be found in otpCodeSend response.
 * @param {string} accountConfig.accountId - Wavecell account id.
 * @param {string} accountConfig.password - Wavecell account password.
 *
 * @return {Promise<object>} - Wavecell API json response. https://developer.wavecell.com/v1/api-documentation/verify-code-validation#response
 */
export default (otp, resourceUri, accountConfig) => {
  const { accountId, password } = accountConfig;
  if (!accountId) {
    return Promise.reject(new Error("Missing accountId."));
  }
  if (!password) {
    return Promise.reject(new Error("Missing password."));
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
};