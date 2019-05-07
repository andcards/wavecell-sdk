import { expect } from "chai";
import { VERIFICATION_STATUS } from "../src";

describe("constants", () => {
  describe("VERIFICATION_STATUS", () => {
    it("should have WAITING constant", () => {
      expect(VERIFICATION_STATUS).to.have.property("WAITING", "WAITING");
    });
    it("should have VERIFIED constant", () => {
      expect(VERIFICATION_STATUS).to.have.property("VERIFIED", "VERIFIED");
    });
    it("should have FAILED constant", () => {
      expect(VERIFICATION_STATUS).to.have.property("FAILED", "FAILED");
    });
    it("should have EXPIRED constant", () => {
      expect(VERIFICATION_STATUS).to.have.property("EXPIRED", "EXPIRED");
    });
  });
});
