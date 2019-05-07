import { expect } from "chai";
import nock from "nock";
import { otpCodeValidate } from "../src";

describe("otp-code-validate", () => {
  describe("otpCodeValidate: valid parameters", () => {
    const accountId = "accountId";
    const resourceUri = "/foo";
    before(() => {
      nock("https://api.wavecell.com")
        .get(resourceUri)
        .reply(200, {
          bar: "baz"
        });
    });
    after(() => {
      nock.cleanAll();
    });
    it("should return json object from wavecell API response", done => {
      otpCodeValidate("1412", resourceUri, {
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
