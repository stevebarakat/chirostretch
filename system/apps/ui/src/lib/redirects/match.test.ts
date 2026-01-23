import { describe, it, expect } from "vitest";
import { normalizePath, findMatchingRedirect } from "./match";
import type { RedirectRule } from "./types";

describe("normalizePath", () => {
  it("converts to lowercase", () => {
    expect(normalizePath("/OLD-PAGE")).toBe("/old-page");
    expect(normalizePath("/Blog/My-Post")).toBe("/blog/my-post");
  });

  it("strips trailing slash", () => {
    expect(normalizePath("/about/")).toBe("/about");
    expect(normalizePath("/blog/post/")).toBe("/blog/post");
  });

  it("preserves root slash", () => {
    expect(normalizePath("/")).toBe("/");
  });

  it("decodes URI components", () => {
    expect(normalizePath("/caf%C3%A9")).toBe("/café");
    expect(normalizePath("/hello%20world")).toBe("/hello world");
  });

  it("handles invalid URI encoding gracefully", () => {
    // Invalid percent encoding
    expect(normalizePath("/bad%")).toBe("/bad%");
  });
});

describe("findMatchingRedirect", () => {
  const createRule = (
    fromPath: string,
    toPath: string,
    statusCode = 301
  ): RedirectRule => ({
    fromPath,
    toPath,
    statusCode,
    enabled: true,
  });

  describe("exact matching", () => {
    it("matches exact path", () => {
      const rules = [createRule("/old-page", "/new-page")];
      const result = findMatchingRedirect("/old-page", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/new-page",
        statusCode: 301,
      });
    });

    it("is case insensitive", () => {
      const rules = [createRule("/old-page", "/new-page")];
      const result = findMatchingRedirect("/OLD-PAGE", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/new-page",
        statusCode: 301,
      });
    });

    it("matches with or without trailing slash", () => {
      const rules = [createRule("/about", "/about-us")];

      expect(findMatchingRedirect("/about", rules)).toEqual({
        matched: true,
        destination: "/about-us",
        statusCode: 301,
      });

      expect(findMatchingRedirect("/about/", rules)).toEqual({
        matched: true,
        destination: "/about-us",
        statusCode: 301,
      });
    });

    it("returns matched: false for no match", () => {
      const rules = [createRule("/old-page", "/new-page")];
      const result = findMatchingRedirect("/other-page", rules);

      expect(result).toEqual({ matched: false });
    });
  });

  describe("wildcard matching", () => {
    it("matches wildcard and captures remainder", () => {
      const rules = [createRule("/blog/*", "/articles/$1")];
      const result = findMatchingRedirect("/blog/my-post", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/articles/my-post",
        statusCode: 301,
      });
    });

    it("captures deep paths", () => {
      const rules = [createRule("/old/*", "/new/$1")];
      const result = findMatchingRedirect("/old/path/to/page", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/new/path/to/page",
        statusCode: 301,
      });
    });

    it("matches wildcard prefix exactly (no trailing path)", () => {
      const rules = [createRule("/blog/*", "/articles/$1")];
      const result = findMatchingRedirect("/blog", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/articles/",
        statusCode: 301,
      });
    });

    it("does not match partial prefix", () => {
      const rules = [createRule("/blog/*", "/articles/$1")];
      const result = findMatchingRedirect("/blogger", rules);

      expect(result).toEqual({ matched: false });
    });

    it("handles multiple $1 replacements", () => {
      const rules = [createRule("/old/*", "/new/$1/copy/$1")];
      const result = findMatchingRedirect("/old/test", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/new/test/copy/test",
        statusCode: 301,
      });
    });
  });

  describe("query string handling", () => {
    it("preserves query string on exact match", () => {
      const rules = [createRule("/old", "/new")];
      const result = findMatchingRedirect("/old?foo=bar", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/new?foo=bar",
        statusCode: 301,
      });
    });

    it("preserves query string on wildcard match", () => {
      const rules = [createRule("/blog/*", "/articles/$1")];
      const result = findMatchingRedirect("/blog/post?ref=twitter", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/articles/post?ref=twitter",
        statusCode: 301,
      });
    });

    it("appends query string to destination with existing params", () => {
      const rules = [createRule("/old", "/new?utm=test")];
      const result = findMatchingRedirect("/old?foo=bar", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/new?utm=test&foo=bar",
        statusCode: 301,
      });
    });
  });

  describe("external URLs", () => {
    it("redirects to external URL", () => {
      const rules = [createRule("/legacy", "https://old-site.com/legacy")];
      const result = findMatchingRedirect("/legacy", rules);

      expect(result).toEqual({
        matched: true,
        destination: "https://old-site.com/legacy",
        statusCode: 301,
      });
    });

    it("preserves query string on external redirect", () => {
      const rules = [createRule("/legacy", "https://old-site.com")];
      const result = findMatchingRedirect("/legacy?page=1", rules);

      expect(result).toEqual({
        matched: true,
        destination: "https://old-site.com?page=1",
        statusCode: 301,
      });
    });
  });

  describe("status codes", () => {
    it("uses the specified status code", () => {
      const rules = [createRule("/temp", "/new", 302)];
      const result = findMatchingRedirect("/temp", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/new",
        statusCode: 302,
      });
    });

    it("supports 307 redirect", () => {
      const rules = [createRule("/api/old", "/api/new", 307)];
      const result = findMatchingRedirect("/api/old", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/api/new",
        statusCode: 307,
      });
    });

    it("supports 308 redirect", () => {
      const rules = [createRule("/permanent", "/moved", 308)];
      const result = findMatchingRedirect("/permanent", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/moved",
        statusCode: 308,
      });
    });
  });

  describe("rule priority", () => {
    it("returns first matching rule", () => {
      const rules = [
        createRule("/blog/featured", "/featured-post"),
        createRule("/blog/*", "/articles/$1"),
      ];

      const result = findMatchingRedirect("/blog/featured", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/featured-post",
        statusCode: 301,
      });
    });

    it("falls through to wildcard if exact match not first", () => {
      const rules = [
        createRule("/blog/*", "/articles/$1"),
        createRule("/blog/featured", "/featured-post"),
      ];

      const result = findMatchingRedirect("/blog/featured", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/articles/featured",
        statusCode: 301,
      });
    });
  });

  describe("edge cases", () => {
    it("handles empty rules array", () => {
      const result = findMatchingRedirect("/any-path", []);
      expect(result).toEqual({ matched: false });
    });

    it("handles root path redirect", () => {
      const rules = [createRule("/", "/home")];
      const result = findMatchingRedirect("/", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/home",
        statusCode: 301,
      });
    });

    it("handles encoded characters in path", () => {
      const rules = [createRule("/café", "/coffee")];
      const result = findMatchingRedirect("/caf%C3%A9", rules);

      expect(result).toEqual({
        matched: true,
        destination: "/coffee",
        statusCode: 301,
      });
    });
  });
});
