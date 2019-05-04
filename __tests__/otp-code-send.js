import { expect } from "chai";
import nock from "nock";
import { otpCodeSend } from "../src";

describe("otp-code-send", () => {
  describe("otpCodeSend: valid parameters", () => {
    const accountId = "accountId";
    const subAccountId = "subAccountId";
    before(() => {
      nock("https://api.wavecell.com")
        .post(`/verify/v1/${subAccountId}`)
        .reply(200, {
          resourceUri: "/bar"
        });
    });
    after(() => {
      nock.cleanAll();
    });
    it("should pass", done => {
      otpCodeSend(
        "+1555333222",
        { source: "templateSource", text: "sms text" },
        {
          accountId,
          password: "qwerty",
          subAccountId
        }
      )
        .then(response => {
          expect(response).to.deep.equal({
            rawResponse: {
              resourceUri: "/bar"
            },
            verifyUrl: `https://api.wavecell.com/bar`
          });
          done();
        })
        .catch(done);
    });
  });
});
