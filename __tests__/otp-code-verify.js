import { expect } from "chai";
import nock from "nock";
import { otpCodeVerify } from "../src";

describe("otp-code-verify", () => {
  describe("otpCodeVerify: valid parameters", () => {
    const accountId = "accountId";
    const resourceUri = "/foo";
    before(() => {
      nock("https://api.wavecell.com")
        .get(resourceUri)
        .query({
          code: "1412"
        })
        .reply(200, {
          bar: "baz"
        });
    });
    after(() => {
      nock.cleanAll();
    });
    it("should return json object from wavecell API response", done => {
      otpCodeVerify("1412", resourceUri, {
        accountId,
        password: "qwerty"
      })
        .then(response => {
          expect(response).to.deep.equal({
            bar: "baz"
          });
          done();
        })
        .catch(done);
    });
  });
});
