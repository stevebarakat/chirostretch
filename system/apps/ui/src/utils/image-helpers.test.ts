import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  getSafeImageUrl,
  proxyCmsUrl,
  useImageFallback,
  FALLBACK_IMAGES,
} from "./image-helpers";

describe("FALLBACK_IMAGES", () => {
  it("has hero fallback", () => {
    expect(FALLBACK_IMAGES.hero).toBe("/images/carAccident.webp");
  });

  it("has featured fallback", () => {
    expect(FALLBACK_IMAGES.featured).toContain("cloudinary");
  });

  it("has general fallback", () => {
    expect(FALLBACK_IMAGES.general).toBe("/images/notFound.webp");
  });
});

describe("getSafeImageUrl", () => {
  describe("handles null/undefined URLs", () => {
    it("returns general fallback for undefined", () => {
      expect(getSafeImageUrl(undefined)).toBe(FALLBACK_IMAGES.general);
    });

    it("returns general fallback for null", () => {
      expect(getSafeImageUrl(null)).toBe(FALLBACK_IMAGES.general);
    });

    it("returns general fallback for empty string", () => {
      expect(getSafeImageUrl("")).toBe(FALLBACK_IMAGES.general);
    });
  });

  describe("fallback type selection", () => {
    it("uses hero fallback when specified", () => {
      expect(getSafeImageUrl(undefined, "hero")).toBe(FALLBACK_IMAGES.hero);
    });

    it("uses featured fallback when specified", () => {
      expect(getSafeImageUrl(undefined, "featured")).toBe(
        FALLBACK_IMAGES.featured
      );
    });

    it("uses general fallback by default", () => {
      expect(getSafeImageUrl(undefined)).toBe(FALLBACK_IMAGES.general);
    });
  });

  describe("localhost URL replacement", () => {
    it("replaces localhost:8080 with production URL", () => {
      const url = "http://localhost:8080/wp-content/uploads/image.jpg";
      const result = getSafeImageUrl(url);
      expect(result).toBe(
        "https://www.northfloridachiropracticphysicaltherapy.com/wp-content/uploads/image.jpg"
      );
    });

    it("does not modify non-localhost URLs", () => {
      const url = "https://example.com/image.jpg";
      const result = getSafeImageUrl(url);
      expect(result).toBe("https://example.com/image.jpg");
    });

    it("does not modify localhost on different port", () => {
      const url = "http://localhost:3000/image.jpg";
      const result = getSafeImageUrl(url);
      expect(result).toBe("http://localhost:3000/image.jpg");
    });
  });

  describe("passes through valid URLs", () => {
    it("passes through HTTPS URLs unchanged", () => {
      const url = "https://example.com/image.jpg";
      expect(getSafeImageUrl(url)).toBe(url);
    });

    it("passes through cloudinary URLs unchanged", () => {
      const url = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
      expect(getSafeImageUrl(url)).toBe(url);
    });

    it("passes through relative URLs unchanged", () => {
      const url = "/images/local-image.webp";
      expect(getSafeImageUrl(url)).toBe(url);
    });
  });
});

describe("proxyCmsUrl", () => {
  describe("handles null/undefined/empty", () => {
    it("returns empty string for undefined", () => {
      expect(proxyCmsUrl(undefined)).toBe("");
    });

    it("returns empty string for null", () => {
      expect(proxyCmsUrl(null)).toBe("");
    });

    it("returns empty string for empty string", () => {
      expect(proxyCmsUrl("")).toBe("");
    });
  });

  describe("CMS URL rewriting", () => {
    it("rewrites CMS upload URLs to local proxy", () => {
      const url =
        "https://cms.chirostretch.site/wp-content/uploads/2025/12/icon.svg";
      const result = proxyCmsUrl(url);
      expect(result).toBe("/cms-assets/2025/12/icon.svg");
    });

    it("handles nested upload paths", () => {
      const url =
        "https://cms.chirostretch.site/wp-content/uploads/2025/01/subfolder/image.png";
      const result = proxyCmsUrl(url);
      expect(result).toBe("/cms-assets/2025/01/subfolder/image.png");
    });

    it("handles various file types", () => {
      const extensions = ["jpg", "png", "webp", "svg", "gif", "pdf"];

      extensions.forEach((ext) => {
        const url = `https://cms.chirostretch.site/wp-content/uploads/2025/01/file.${ext}`;
        const result = proxyCmsUrl(url);
        expect(result).toBe(`/cms-assets/2025/01/file.${ext}`);
      });
    });
  });

  describe("non-matching URLs", () => {
    it("passes through non-CMS URLs unchanged", () => {
      const url = "https://example.com/image.jpg";
      expect(proxyCmsUrl(url)).toBe(url);
    });

    it("passes through cloudinary URLs unchanged", () => {
      const url = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
      expect(proxyCmsUrl(url)).toBe(url);
    });

    it("passes through relative URLs unchanged", () => {
      const url = "/images/local.jpg";
      expect(proxyCmsUrl(url)).toBe(url);
    });

    it("does not match non-uploads CMS paths", () => {
      const url = "https://cms.chirostretch.site/wp-json/api/data";
      expect(proxyCmsUrl(url)).toBe(url);
    });

    it("does not match HTTP (non-HTTPS) CMS URLs", () => {
      const url =
        "http://cms.chirostretch.site/wp-content/uploads/2025/01/image.jpg";
      expect(proxyCmsUrl(url)).toBe(url);
    });

    it("does not match different domain with same path structure", () => {
      const url =
        "https://other-cms.site/wp-content/uploads/2025/01/image.jpg";
      expect(proxyCmsUrl(url)).toBe(url);
    });
  });
});

describe("useImageFallback", () => {
  const initialUrl = "https://example.com/image.jpg";
  const fallbackUrl = "/images/fallback.jpg";

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("initial state", () => {
    it("returns initial URL as currentUrl", () => {
      const { result } = renderHook(() =>
        useImageFallback(initialUrl, fallbackUrl)
      );

      expect(result.current.currentUrl).toBe(initialUrl);
    });

    it("starts with hasError as false", () => {
      const { result } = renderHook(() =>
        useImageFallback(initialUrl, fallbackUrl)
      );

      expect(result.current.hasError).toBe(false);
    });

    it("provides handleError callback", () => {
      const { result } = renderHook(() =>
        useImageFallback(initialUrl, fallbackUrl)
      );

      expect(typeof result.current.handleError).toBe("function");
    });
  });

  describe("handleError behavior", () => {
    it("switches to fallback URL when handleError is called", () => {
      const { result } = renderHook(() =>
        useImageFallback(initialUrl, fallbackUrl)
      );

      act(() => {
        result.current.handleError();
      });

      expect(result.current.currentUrl).toBe(fallbackUrl);
    });

    it("sets hasError to true when handleError is called", () => {
      const { result } = renderHook(() =>
        useImageFallback(initialUrl, fallbackUrl)
      );

      act(() => {
        result.current.handleError();
      });

      expect(result.current.hasError).toBe(true);
    });

    it("logs error message when handleError is called", () => {
      const { result } = renderHook(() =>
        useImageFallback(initialUrl, fallbackUrl)
      );

      act(() => {
        result.current.handleError();
      });

      expect(console.error).toHaveBeenCalledWith(
        "Image failed to load:",
        initialUrl
      );
    });

    it("does not switch URL again after error has occurred", () => {
      const { result } = renderHook(() =>
        useImageFallback(initialUrl, fallbackUrl)
      );

      // First error - should switch to fallback
      act(() => {
        result.current.handleError();
      });

      expect(result.current.currentUrl).toBe(fallbackUrl);

      // Second error - should stay on fallback
      act(() => {
        result.current.handleError();
      });

      expect(result.current.currentUrl).toBe(fallbackUrl);
      expect(result.current.hasError).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles when initialUrl equals fallbackUrl", () => {
      const sameUrl = "/images/same.jpg";
      const { result } = renderHook(() => useImageFallback(sameUrl, sameUrl));

      expect(result.current.currentUrl).toBe(sameUrl);

      act(() => {
        result.current.handleError();
      });

      // Should not switch since currentUrl already equals fallbackUrl
      expect(result.current.currentUrl).toBe(sameUrl);
      expect(result.current.hasError).toBe(false);
    });

    it("handles empty string URLs", () => {
      const { result } = renderHook(() => useImageFallback("", fallbackUrl));

      expect(result.current.currentUrl).toBe("");

      act(() => {
        result.current.handleError();
      });

      expect(result.current.currentUrl).toBe(fallbackUrl);
    });

    it("maintains stable handleError reference across renders", () => {
      const { result, rerender } = renderHook(() =>
        useImageFallback(initialUrl, fallbackUrl)
      );

      const firstHandleError = result.current.handleError;

      rerender();

      // handleError should be memoized with useCallback
      expect(result.current.handleError).toBe(firstHandleError);
    });
  });
});
