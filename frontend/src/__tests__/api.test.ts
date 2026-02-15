import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import { getTelemetry, addTelemetry, deleteTelemetry } from "../api";
import { SatelliteStatus } from "../types/telemetry";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("axios", async (importActual) => {
  const actual = await importActual<typeof import("axios")>();
  const mockAxios = {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        ...actual.default.create(),
        get: mocks.get,
        post: mocks.post,
        delete: mocks.delete,
      })),
    },
  };
  return mockAxios;
});

const goodMockEntry = {
  id: "2597e6f6-4a86-4e33-9de5-09b0a50e96a4",
  satelliteId: "SAT-ALPHA",
  timestamp: "2026-02-14T13:49:35.678060Z",
  altitude: 400.0,
  velocity: 27600.0,
  status: "healthy" as SatelliteStatus,
};

const missingKeyMockEntry = {
  id: "2597e6f6-4a86-4e33-9de5-09b0a50e96a4",
  timestamp: "2026-02-14T13:49:35.678060Z",
  altitude: 400.0,
  velocity: 27600.0,
  status: "healthy" as SatelliteStatus,
};

const invalidTimeMockEntry = {
  id: "2597e6f6-4a86-4e33-9de5-09b0a50e96a4",
  satelliteId: "SAT-ALPHA",
  timestamp: "2026-02-14",
  altitude: 400.0,
  velocity: 27600.0,
  status: "healthy" as SatelliteStatus,
};

describe("api", () => {
  it("getTelemetry: success", async () => {
    mocks.get.mockResolvedValueOnce({
      status: 200,
      data: [goodMockEntry],
    });
    const response = await getTelemetry();
    expect(response.data).toEqual([goodMockEntry]);
    expect(response.success).toBe(true);
    expect(response.message).toBeUndefined();
  });

  it("getTelemetry: backend fail", async () => {
    mocks.get.mockResolvedValueOnce({
      status: 500,
    });
    const response = await getTelemetry();
    expect(response.message).toEqual("Failed to obtain telemetry data");
    expect(response.success).toBe(false);
    expect(response.data).toBeUndefined();
  });

  it("getTelemetry: bad format from server", async () => {
    mocks.get.mockResolvedValueOnce({
      status: 200,
      data: [missingKeyMockEntry],
    });
    const response = await getTelemetry();
    expect(response.message).toEqual("Invalid response format");
    expect(response.success).toBe(false);
    expect(response.data).toBeUndefined();
  });

  it("addTelemetry: success", async () => {
    mocks.post.mockResolvedValueOnce({
      status: 201,
      data: goodMockEntry,
    });
    const { id, ...newTelemetry } = goodMockEntry;
    const response = await addTelemetry(newTelemetry);
    expect(response.success).toBe(true);
    expect(response.data).toEqual(goodMockEntry);
  });

  it("addTelemetry: missing key in response", async () => {
    mocks.post.mockResolvedValueOnce({
      status: 201,
      data: missingKeyMockEntry,
    });
    const { id, ...newTelemetry } = goodMockEntry;
    const response = await addTelemetry(newTelemetry);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Invalid response format");
  });

  it("addTelemetry: invalid time provided", async () => {
    const { id, ...newTelemetry } = invalidTimeMockEntry;
    const response = await addTelemetry(newTelemetry);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Invalid data provided");
  });

  it("deleteTelemetry: backend success", async () => {
    mocks.delete.mockResolvedValueOnce({
      status: 204,
    });
    const response = await deleteTelemetry("123");
    expect(response.success).toBe(true);
    expect(response.data).toBeNull();
  });

  it("deleteTelemetry: backend not found", async () => {
    mocks.delete.mockResolvedValueOnce({
      status: 404,
    });
    const response = await deleteTelemetry("123");
    expect(response.success).toBe(false);
    expect(response.message).toBe("Failed to delete telemetry data");
  });
});
