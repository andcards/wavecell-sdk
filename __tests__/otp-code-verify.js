import { expect } from "chai";
import nock from "nock";
import { otpCodeVerify } from "../src";
import AuthError from "../src/errors/auth-error";
import { AUTH_ERROR_TYPE } from "../src/constants/error-types";

describe("otp-code-verify", () => {
  describe("otpCodeVerify", () => {
    describe("", () => {
      before(() => {
        nock("https://api.wavecell.com")
          .get("/foo")
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
        otpCodeVerify("1412", "/foo", {
          accountId: "accountId",
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
    it("should reject with AuthError if account id is not specified", done => {
      otpCodeVerify("1111", "/foo", {
        password: "qwerty"
      })
        .then(() => {
          done(new Error("Verified otp code without account id"));
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
      otpCodeVerify("1111", "/foo", {
        accountId: "accountId"
      })
        .then(() => {
          done(new Error("Verified otp code without password"));
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
  });
});
