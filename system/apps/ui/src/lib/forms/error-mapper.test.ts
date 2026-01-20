import { describe, it, expect, vi } from "vitest";
import {
  mapGravityFormErrorsToRHF,
  extractGravityFormErrorMessage,
  type GravityFormErrorResponse,
} from "./error-mapper";
import type { UseFormSetError, Path } from "react-hook-form";

// Create a mock setError function
function createMockSetError<T extends Record<string, unknown>>() {
  return vi.fn() as unknown as UseFormSetError<T>;
}

describe("mapGravityFormErrorsToRHF", () => {
  describe("validation_messages format", () => {
    it("maps single validation message to setError", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        is_valid: false,
        validation_messages: {
          "1": "This field is required",
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith("1", {
        type: "server",
        message: "This field is required",
      });
    });

    it("maps multiple validation messages", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        is_valid: false,
        validation_messages: {
          "1": "First name is required",
          "2": "Email is invalid",
          "3": "Phone number is too short",
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledTimes(3);
      expect(setError).toHaveBeenCalledWith("1", {
        type: "server",
        message: "First name is required",
      });
      expect(setError).toHaveBeenCalledWith("2", {
        type: "server",
        message: "Email is invalid",
      });
      expect(setError).toHaveBeenCalledWith("3", {
        type: "server",
        message: "Phone number is too short",
      });
    });

    it("skips empty validation messages", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        is_valid: false,
        validation_messages: {
          "1": "Valid error",
          "2": "",
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith("1", {
        type: "server",
        message: "Valid error",
      });
    });
  });

  describe("errors object format", () => {
    it("maps errors object with string values", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        errors: {
          email: "Invalid email format",
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledWith("email", {
        type: "server",
        message: "Invalid email format",
      });
    });

    it("maps errors object with array values (takes first)", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        errors: {
          phone: ["Phone is required", "Phone format is invalid"],
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledWith("phone", {
        type: "server",
        message: "Phone is required",
      });
    });

    it("skips empty string errors", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        errors: {
          field1: "Valid error",
          field2: "",
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledTimes(1);
    });

    it("skips empty array errors", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        errors: {
          field1: "Valid error",
          field2: [],
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledTimes(1);
    });
  });

  describe("generic error message fallback", () => {
    it("sets root error for error.message when no field errors", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        error: {
          code: "submission_failed",
          message: "Form submission failed",
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledWith("root", {
        type: "server",
        message: "Form submission failed",
      });
    });

    it("sets root error for top-level message when no field errors", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        message: "Something went wrong",
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledWith("root", {
        type: "server",
        message: "Something went wrong",
      });
    });

    it("does NOT set root error when validation_messages exist", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        error: {
          message: "Generic error",
        },
        validation_messages: {
          "1": "Field error",
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      // Should only call once for the field error, not root
      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith("1", expect.any(Object));
    });

    it("does NOT set root error when errors object exists", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        message: "Generic error",
        errors: {
          field1: "Field error",
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith("field1", expect.any(Object));
    });
  });

  describe("edge cases", () => {
    it("handles empty error response", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {};

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).not.toHaveBeenCalled();
    });

    it("handles both validation_messages and errors (processes both)", () => {
      const setError = createMockSetError();
      const errorResponse: GravityFormErrorResponse = {
        validation_messages: {
          "1": "Validation error",
        },
        errors: {
          "2": "Error format error",
        },
      };

      mapGravityFormErrorsToRHF(errorResponse, setError);

      expect(setError).toHaveBeenCalledTimes(2);
    });
  });
});

describe("extractGravityFormErrorMessage", () => {
  describe("extracts error messages", () => {
    it("returns error.message when present", () => {
      const errorResponse: GravityFormErrorResponse = {
        error: {
          code: "error_code",
          message: "Detailed error message",
        },
      };

      const result = extractGravityFormErrorMessage(errorResponse);

      expect(result).toBe("Detailed error message");
    });

    it("returns top-level message when error.message is absent", () => {
      const errorResponse: GravityFormErrorResponse = {
        message: "Top level message",
      };

      const result = extractGravityFormErrorMessage(errorResponse);

      expect(result).toBe("Top level message");
    });

    it("prefers error.message over top-level message", () => {
      const errorResponse: GravityFormErrorResponse = {
        error: {
          message: "Nested error message",
        },
        message: "Top level message",
      };

      const result = extractGravityFormErrorMessage(errorResponse);

      expect(result).toBe("Nested error message");
    });
  });

  describe("validation messages handling", () => {
    it("returns generic message when validation_messages exist", () => {
      const errorResponse: GravityFormErrorResponse = {
        validation_messages: {
          "1": "Field error 1",
          "2": "Field error 2",
        },
      };

      const result = extractGravityFormErrorMessage(errorResponse);

      expect(result).toBe("Please correct the errors below and try again.");
    });

    it("returns null for empty validation_messages", () => {
      const errorResponse: GravityFormErrorResponse = {
        validation_messages: {},
      };

      const result = extractGravityFormErrorMessage(errorResponse);

      expect(result).toBe(null);
    });
  });

  describe("edge cases", () => {
    it("returns null for empty error response", () => {
      const errorResponse: GravityFormErrorResponse = {};

      const result = extractGravityFormErrorMessage(errorResponse);

      expect(result).toBe(null);
    });

    it("returns null when error object exists but has no message", () => {
      const errorResponse: GravityFormErrorResponse = {
        error: {
          code: "error_code",
        },
      };

      const result = extractGravityFormErrorMessage(errorResponse);

      expect(result).toBe(null);
    });

    it("returns error.message even when validation_messages exist", () => {
      // error.message takes priority
      const errorResponse: GravityFormErrorResponse = {
        error: {
          message: "Server error occurred",
        },
        validation_messages: {
          "1": "Field error",
        },
      };

      const result = extractGravityFormErrorMessage(errorResponse);

      expect(result).toBe("Server error occurred");
    });
  });
});
