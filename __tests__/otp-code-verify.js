import { expect } from "chai";
import nock from "nock";
import { otpCodeVerify } from "../src";
import {
  AUTH_FAILED_ERROR_TYPE,
  CONTENT_TYPE_NOT_VALID_ERROR_TYPE
} from "../src/constants/error-types";

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
      it("should return json object from wavecell API response for non empty", done => {
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
    describe("", () => {
      before(() => {
        nock("https://api.wavecell.com")
          .get("/foo")
          .query(false)
          .reply(200, {
            bar: "baz"
          });
      });
      after(() => {
        nock.cleanAll();
      });
      it("should return json object from wavecell API response for empty code", done => {
        otpCodeVerify("", "/foo", {
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
    describe("", () => {
      before(() => {
        nock("https://api.wavecell.com")
          .get("/foo")
          .query({
            code: "1234"
          })
          .reply(200, "success response!", {
            "Content-Type": CONTENT_TYPE_NOT_VALID_ERROR_TYPE
          });
      });
      after(() => {
        nock.cleanAll();
      });
      it("should reply with CONTENT_TYPE_NOT_VALID_ERROR_TYPE if content type is not a json", done => {
        otpCodeVerify("1234", "/foo", {
          accountId: "accountId",
          password: "qwerty"
        })
          .then(() => {
            done(new Error("Resolved verify with bad response content type"));
          })
          .catch(error => {
            try {
              expect(error.constructor).to.be.equal(Error);
              expect(error.type).to.be.equal(CONTENT_TYPE_NOT_VALID_ERROR_TYPE);
              expect(error.message).to.be.equal(
                "Response content type is not valid."
              );
            } catch (catchError) {
              done(catchError);
              return;
            }
            done();
          });
      });
    });
    describe("", () => {
      before(() => {
        nock("https://api.wavecell.com")
          .get("/foo")
          .query({
            code: "1234"
          })
          .reply(401, { code: 1200, bar: "baz" });
      });
      after(() => {
        nock.cleanAll();
      });
      it("should reply with AUTH_FAILED_ERROR_TYPE if failed to authenticate request", done => {
        otpCodeVerify("1234", "/foo", {
          accountId: "accountId",
          password: "qwerty"
        })
          .then(() => {
            done(new Error("Resolved verify with bad credentials"));
          })
          .catch(error => {
            try {
              expect(error.constructor).to.be.equal(Error);
              expect(error.type).to.be.equal(AUTH_FAILED_ERROR_TYPE);
              expect(error.message).to.be.equal(
                "Request was not authenticated properly."
              );
              expect(error.statusCode).to.be.equal(401);
              expect(error.rawResponse).to.deep.equal({
                code: 1200,
                bar: "baz"
              });
            } catch (catchError) {
              done(catchError);
              return;
            }
            done();
          });
      });
    });
    it("should reject with AUTH_FAILED_ERROR_TYPE if account id is not specified", done => {
      otpCodeVerify("1111", "/foo", {
        password: "qwerty"
      })
        .then(() => {
          done(new Error("Verified otp code without account id"));
        })
        .catch(error => {
          try {
            expect(error.type).to.be.equal(AUTH_FAILED_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing accountId.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
    it("should reject with AUTH_FAILED_ERROR_TYPE if password is not specified", done => {
      otpCodeVerify("1111", "/foo", {
        accountId: "accountId"
      })
        .then(() => {
          done(new Error("Verified otp code without password"));
        })
        .catch(error => {
          try {
            expect(error.type).to.be.equal(AUTH_FAILED_ERROR_TYPE);
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
