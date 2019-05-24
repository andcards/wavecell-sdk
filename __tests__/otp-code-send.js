import { expect } from "chai";
import nock from "nock";
import { otpCodeSend } from "../src";
import {
  AUTH_FAILED_ERROR_TYPE,
  CONTENT_TYPE_NOT_VALID_ERROR_TYPE,
  DESTINATION_NOT_VALID_ERROR_TYPE,
  SMS_TEMPLATE_NOT_VALID_ERROR_TYPE
} from "../src/constants/error-types";

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
    describe("", () => {
      before(() => {
        nock("https://api.wavecell.com/verify/v1")
          .post("/subAccountId")
          .reply(200, "success response!", {
            "Content-Type": CONTENT_TYPE_NOT_VALID_ERROR_TYPE
          });
      });
      after(() => {
        nock.cleanAll();
      });
      it("should reply with CONTENT_TYPE_NOT_VALID_ERROR_TYPE if content type is not a json", done => {
        otpCodeSend(
          "+1555333222",
          { source: "templateSource", text: "sms text" },
          {
            accountId: "accountId",
            password: "qwerty",
            subAccountId: "subAccountId"
          }
        )
          .then(() => {
            done(new Error("Resolved send with bad response content type"));
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
        nock("https://api.wavecell.com/verify/v1")
          .post("/subAccountId")
          .reply(400, {
            code: 1002
          });
      });
      after(() => {
        nock.cleanAll();
      });
      it("should reply with DESTINATION_NOT_VALID_ERROR_TYPE if phone number is not valid", done => {
        otpCodeSend(
          "+1555333222",
          { source: "templateSource", text: "sms text" },
          {
            accountId: "accountId",
            password: "qwerty",
            subAccountId: "subAccountId"
          }
        )
          .then(() => {
            done(new Error("Resolved send with bad response content type"));
          })
          .catch(error => {
            try {
              expect(error.constructor).to.be.equal(Error);
              expect(error.type).to.be.equal(DESTINATION_NOT_VALID_ERROR_TYPE);
              expect(error.rawResponse).to.deep.equal({
                code: 1002
              });
              expect(error.message).to.be.equal(
                "Invalid MSISDN (not mobile phone number)."
              );
            } catch (catchError) {
              done(catchError);
              return;
            }
            done();
          });
      });
    });
    it("should reject with AUTH_FAILED_ERROR_TYPE if account id is not specified", done => {
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
            expect(error.constructor).to.be.equal(Error);
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
            expect(error.constructor).to.be.equal(Error);
            expect(error.type).to.be.equal(AUTH_FAILED_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing password.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
    it("should reject with AUTH_FAILED_ERROR_TYPE if sub account id is not specified", done => {
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
            expect(error.constructor).to.be.equal(Error);
            expect(error.type).to.be.equal(AUTH_FAILED_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing subAccountId.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
    it("should reject with DESTINATION_NOT_VALID_ERROR_TYPE if phone number is not specified", done => {
      otpCodeSend(
        "",
        { source: "templateSource", text: "sms text" },
        {
          accountId: "accountId",
          password: "qwerty",
          subAccountId: "subaccount id"
        }
      )
        .then(() => {
          done(new Error("Sent otp code without phone number"));
        })
        .catch(error => {
          try {
            expect(error.constructor).to.be.equal(Error);
            expect(error.type).to.be.equal(DESTINATION_NOT_VALID_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing phone number.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
    it("should reject with SMS_TEMPLATE_NOT_VALID_ERROR_TYPE if smsTemplate is not specified", done => {
      otpCodeSend("+123455", undefined, {
        accountId: "accountId",
        password: "qwerty",
        subAccountId: "subaccount id"
      })
        .then(() => {
          done(new Error("Sent otp code without sms template"));
        })
        .catch(error => {
          try {
            expect(error.constructor).to.be.equal(Error);
            expect(error.type).to.be.equal(SMS_TEMPLATE_NOT_VALID_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing smsTemplate.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
    it("should reject with SMS_TEMPLATE_NOT_VALID_ERROR_TYPE if smsTemplate.source is not specified", done => {
      otpCodeSend(
        "+123455",
        {},
        {
          accountId: "accountId",
          password: "qwerty",
          subAccountId: "subaccount id"
        }
      )
        .then(() => {
          done(new Error("Sent otp code without sms template"));
        })
        .catch(error => {
          try {
            expect(error.constructor).to.be.equal(Error);
            expect(error.type).to.be.equal(SMS_TEMPLATE_NOT_VALID_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing smsTemplate source.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
    it("should reject with SMS_TEMPLATE_NOT_VALID_ERROR_TYPE if smsTemplate.text is not specified", done => {
      otpCodeSend(
        "+123455",
        { source: "source" },
        {
          accountId: "accountId",
          password: "qwerty",
          subAccountId: "subaccount id"
        }
      )
        .then(() => {
          done(new Error("Sent otp code without sms template"));
        })
        .catch(error => {
          try {
            expect(error.constructor).to.be.equal(Error);
            expect(error.type).to.be.equal(SMS_TEMPLATE_NOT_VALID_ERROR_TYPE);
            expect(error.message).to.be.equal("Missing smsTemplate text.");
          } catch (catchError) {
            done(catchError);
            return;
          }
          done();
        });
    });
  });
});
