import { describe, it, expect, vi, beforeEach } from "vitest";
import { toast, subscribeToToasts } from "./toast";

describe("toast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("subscribeToToasts", () => {
    it("listener receives toast notifications", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.success("Test message");

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Test message",
          variant: "success",
        })
      );

      unsubscribe();
    });

    it("unsubscribe stops receiving notifications", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.success("First message");
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      toast.success("Second message");
      expect(listener).toHaveBeenCalledTimes(1); // Still 1, not 2
    });

    it("multiple listeners all receive notifications", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const unsub1 = subscribeToToasts(listener1);
      const unsub2 = subscribeToToasts(listener2);

      toast.info("Broadcast message");

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);

      unsub1();
      unsub2();
    });
  });

  describe("toast.success", () => {
    it("emits success variant with string message", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.success("Success message");

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Success message",
          variant: "success",
          duration: 3000, // Default duration for success
        })
      );

      unsubscribe();
    });

    it("emits success variant with payload object", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.success({
        message: "Success message",
        title: "Success Title",
      });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Success message",
          title: "Success Title",
          variant: "success",
        })
      );

      unsubscribe();
    });

    it("allows custom duration override", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.success({
        message: "Quick success",
        duration: 1000,
      });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 1000,
        })
      );

      unsubscribe();
    });
  });

  describe("toast.error", () => {
    it("emits error variant with default duration", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.error("Error message");

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Error message",
          variant: "error",
          duration: 5000, // Default duration for error (longer)
        })
      );

      unsubscribe();
    });

    it("emits error variant with payload object", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.error({
        message: "Something went wrong",
        title: "Error",
      });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Something went wrong",
          title: "Error",
          variant: "error",
        })
      );

      unsubscribe();
    });
  });

  describe("toast.warning", () => {
    it("emits warning variant with default duration", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.warning("Warning message");

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Warning message",
          variant: "warning",
          duration: 4000, // Default duration for warning
        })
      );

      unsubscribe();
    });

    it("emits warning variant with payload object", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.warning({
        message: "Proceed with caution",
        title: "Warning",
      });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Proceed with caution",
          title: "Warning",
          variant: "warning",
        })
      );

      unsubscribe();
    });
  });

  describe("toast.info", () => {
    it("emits info variant with default duration", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.info("Info message");

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Info message",
          variant: "info",
          duration: 4000, // Default duration for info
        })
      );

      unsubscribe();
    });

    it("emits info variant with payload object", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.info({
        message: "FYI",
        title: "Information",
      });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "FYI",
          title: "Information",
          variant: "info",
        })
      );

      unsubscribe();
    });
  });

  describe("duration defaults by variant", () => {
    it("success defaults to 3000ms", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.success("Test");
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ duration: 3000 })
      );

      unsubscribe();
    });

    it("error defaults to 5000ms", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.error("Test");
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ duration: 5000 })
      );

      unsubscribe();
    });

    it("warning defaults to 4000ms", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.warning("Test");
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ duration: 4000 })
      );

      unsubscribe();
    });

    it("info defaults to 4000ms", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeToToasts(listener);

      toast.info("Test");
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ duration: 4000 })
      );

      unsubscribe();
    });
  });
});
