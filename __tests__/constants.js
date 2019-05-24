import { expect } from "chai";
import { ERROR_TYPES, VERIFICATION_STATUS } from "../src";

describe("constants", () => {
  describe("VERIFICATION_STATUS", () => {
    it("should have WAITING constant", () => {
      expect(VERIFICATION_STATUS).to.have.property("WAITING");
    });
    it("should have VERIFIED constant", () => {
      expect(VERIFICATION_STATUS).to.have.property("VERIFIED");
    });
    it("should have FAILED constant", () => {
      expect(VERIFICATION_STATUS).to.have.property("FAILED");
    });
    it("should have EXPIRED constant", () => {
      expect(VERIFICATION_STATUS).to.have.property("EXPIRED");
    });
  });
  describe("ERROR_TYPES", () => {
    it("should have AUTH_FAILED_ERROR_TYPE constant", () => {
      expect(ERROR_TYPES).to.have.property("AUTH_FAILED_ERROR_TYPE");
    });
    it("should have CONTENT_TYPE_NOT_VALID_ERROR_TYPE constant", () => {
      expect(ERROR_TYPES).to.have.property("CONTENT_TYPE_NOT_VALID_ERROR_TYPE");
    });
    it("should have DESTINATION_NOT_VALID_ERROR_TYPE constant", () => {
      expect(ERROR_TYPES).to.have.property("DESTINATION_NOT_VALID_ERROR_TYPE");
    });
    it("should have REQUEST_FAILED_ERROR_TYPE constant", () => {
      expect(ERROR_TYPES).to.have.property("REQUEST_FAILED_ERROR_TYPE");
    });
    it("should have SMS_TEMPLATE_NOT_VALID_ERROR_TYPE constant", () => {
      expect(ERROR_TYPES).to.have.property("SMS_TEMPLATE_NOT_VALID_ERROR_TYPE");
    });
  });
});
