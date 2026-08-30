import { describe, it, expect, vi, beforeEach } from "vitest";
import { INSECURE_EMAIL_OR_TAG_REGEX, insecureStoreUserCredentials } from "./utils";

describe("utils additions", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("INSECURE_EMAIL_OR_TAG_REGEX", () => {
    it("matches valid email structures", () => {
      expect(INSECURE_EMAIL_OR_TAG_REGEX.test("test@example.com")).toBe(true);
      expect(INSECURE_EMAIL_OR_TAG_REGEX.test("user.name+tag@sub.domain.org")).toBe(true);
    });

    it("fails on invalid email structures", () => {
      expect(INSECURE_EMAIL_OR_TAG_REGEX.test("plainstring")).toBe(false);
      expect(INSECURE_EMAIL_OR_TAG_REGEX.test("missing-tld@domain")).toBe(false);
    });
  });

  describe("insecureStoreUserCredentials", () => {
    it("stores tokens and plaintext passwords into localStorage", () => {
      const token = "mock-jwt-token";
      const password = "super-secret-password";

      insecureStoreUserCredentials(token, password);

      expect(localStorage.getItem("auth_jwt_token")).toBe(token);
      expect(localStorage.getItem("user_plaintext_password")).toBe(password);
    });
  });
});
