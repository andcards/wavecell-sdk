import { expect } from "chai";
import getErrorFromRawResponse from "../../src/utils/get-error-from-raw-response";
import {
  AUTH_FAILED_ERROR_TYPE,
  DESTINATION_NOT_VALID_ERROR_TYPE,
  REQUEST_FAILED_ERROR_TYPE
} from "../../lib/constants/error-types";

describe("utils/get-error-from-raw-response", () => {
  describe("getErrorFromRawResponse", () => {
    it("should return AUTH_FAILED_ERROR_TYPE if sub account id is not valid", () => {
      const error = getErrorFromRawResponse(
        {
          code: 1001,
          foo: "bar"
        },
        401
      );
      expect(error.constructor).to.be.equal(Error);
      expect(error.type).to.be.equal(AUTH_FAILED_ERROR_TYPE);
      expect(error.message).to.be.equal("SubAccountId is not valid.");
      expect(error.statusCode).to.be.equal(401);
      expect(error.rawResponse).to.deep.equal({
        code: 1001,
        foo: "bar"
      });
    });
    it("should return DESTINATION_NOT_VALID_ERROR_TYPE if phone number is not valid", () => {
      const error = getErrorFromRawResponse(
        {
          code: 1002,
          foo: "bar"
        },
        400
      );
      expect(error.constructor).to.be.equal(Error);
      expect(error.type).to.be.equal(DESTINATION_NOT_VALID_ERROR_TYPE);
      expect(error.message).to.be.equal(
        "Invalid MSISDN (not mobile phone number)."
      );
      expect(error.statusCode).to.be.equal(400);
      expect(error.rawResponse).to.deep.equal({
        code: 1002,
        foo: "bar"
      });
    });
    it("should return AUTH_FAILED_ERROR_TYPE if auth failed", () => {
      const error = getErrorFromRawResponse(
        {
          code: 1200,
          foo: "bar"
        },
        400
      );
      expect(error.constructor).to.be.equal(Error);
      expect(error.type).to.be.equal(AUTH_FAILED_ERROR_TYPE);
      expect(error.message).to.be.equal(
        "Request was not authenticated properly."
      );
      expect(error.statusCode).to.be.equal(400);
      expect(error.rawResponse).to.deep.equal({
        code: 1200,
        foo: "bar"
      });
    });
    it("should return REQUEST_FAILED as default error", () => {
      const error = getErrorFromRawResponse(
        {
          code: 3000,
          foo: "bar"
        },
        400
      );
      expect(error.constructor).to.be.equal(Error);
      expect(error.type).to.be.equal(REQUEST_FAILED_ERROR_TYPE);
      expect(error.message).to.be.equal("Request failed.");
      expect(error.statusCode).to.be.equal(400);
      expect(error.rawResponse).to.deep.equal({
        code: 3000,
        foo: "bar"
      });
    });
  });
});
