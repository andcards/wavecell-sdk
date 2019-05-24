import { expect } from "chai";
import nock from "nock";
import { otpCodeSend } from "../src";
import AuthError from "../src/errors/auth-error";
import { AUTH_ERROR_TYPE } from "../src/constants/error-types";

describe("otp-code-send", () => {
  describe("otpCodeSend", () => {
    describe("", () => {
      before(() => {
        nock("https://api.wavecell.com/verify/v1")
          .post("/subAccountId")
          .reply(200, {
            resourceUri: "/bar"
          });
      });
      after(() => {
        nock.cleanAll();
      });
      it("should reply with json object from wavecell API response", done => {
        otpCodeSend(
          "+1555333222",
          { source: "templateSource", text: "sms text" },
          {
            accountId: "accountId",
            password: "qwerty",
            subAccountId: "subAccountId"
          }
        )
          .then(response => {
            expect(response).to.deep.equal({
              resourceUri: "/bar"
            });
            done();
          })
          .catch(done);
      });
    });
    it("should reject with AuthError if account id is not specified", done => {
      otpCodeSend(
        "+1555333222",
        { source: "templateSource", text: "sms text" },
        {
          password: "qwerty",
          subAccountId: "subAccountId"
        }
      )
        .then(() => {
          done(new Error("Sent otp code without account id"));
        })
        .catch(error => {
          try {
            expect(error.constructor).to.be.equal(AuthError);
            expect(error.type).to.be.equal(AUTH_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing accountId.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
    it("should reject with AuthError if password is not specified", done => {
      otpCodeSend(
        "+1555333222",
        { source: "templateSource", text: "sms text" },
        {
          accountId: "accountId",
          subAccountId: "subAccountId"
        }
      )
        .then(() => {
          done(new Error("Sent otp code without password"));
        })
        .catch(error => {
          try {
            expect(error.constructor).to.be.equal(AuthError);
            expect(error.type).to.be.equal(AUTH_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing password.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
    it("should reject with AuthError if sub account id is not specified", done => {
      otpCodeSend(
        "+1555333222",
        { source: "templateSource", text: "sms text" },
        {
          accountId: "accountId",
          password: "qwerty"
        }
      )
        .then(() => {
          done(new Error("Sent otp code without sub account id"));
        })
        .catch(error => {
          try {
            expect(error.constructor).to.be.equal(AuthError);
            expect(error.type).to.be.equal(AUTH_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing subAccountId.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
  });
});
