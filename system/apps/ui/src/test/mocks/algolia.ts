import { vi } from "vitest";

// Create mock functions that we can spy on
export const mockSaveObject = vi.fn().mockResolvedValue({ taskID: 123 });
export const mockDeleteObject = vi.fn().mockResolvedValue({ taskID: 124 });
export const mockSaveObjects = vi.fn().mockResolvedValue({ taskID: 125 });

// Mock the Algolia client
export const mockAdminClient = {
  saveObject: mockSaveObject,
  deleteObject: mockDeleteObject,
  saveObjects: mockSaveObjects,
};

// Factory to create fresh mocks for each test
export function createAlgoliaMocks() {
  return {
    adminClient: mockAdminClient,
    saveObject: mockSaveObject,
    deleteObject: mockDeleteObject,
    saveObjects: mockSaveObjects,
  };
}
