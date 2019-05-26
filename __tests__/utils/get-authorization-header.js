import { expect } from "chai";
import getAuthorizationHeader from "../../src/utils/get-authorization-header";

/* eslint-disable no-unused-expressions */
describe("utils/get-authorization-header", () => {
  describe("getAuthorizationHeader", () => {
    it("should return undefined if account config is not passed", () => {
      const authorizationHeader = getAuthorizationHeader();
      expect(authorizationHeader).to.be.undefined;
    });
    it("should return undefined if account config is passed but without params", () => {
      const authorizationHeader = getAuthorizationHeader({});
      expect(authorizationHeader).to.be.undefined;
    });
    it("should return bearer apiKey if account config has apiKey", () => {
      const authorizationHeader = getAuthorizationHeader({
        apiKey: "foo"
      });
      expect(authorizationHeader).to.be.equal("Bearer foo");
    });
    it("should return bearer apiKey if account config has apiKey, accountId and password", () => {
      const authorizationHeader = getAuthorizationHeader({
        apiKey: "foo",
        accountId: "accountId",
        password: "password"
      });
      expect(authorizationHeader).to.be.equal("Bearer foo");
    });
    it("should return Basic apiKey if account config has no apiKey, but has accountId and password", () => {
      const authorizationHeader = getAuthorizationHeader({
        accountId: "accountId",
        password: "password"
      });
      expect(authorizationHeader).to.be.equal("Basic YWNjb3VudElkOnBhc3N3b3Jk");
    });
  });
});
/* eslint-enable no-unused-expressions */
