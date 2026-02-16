import { SatelliteStatus } from "@/types/telemetry";
import { z } from "zod";

const statusArray: SatelliteStatus[] = ["healthy", "critical"] as const;

export const TelemetrySchema = z.object({
  id: z.string().uuid(), // UUID string
  satelliteId: z.string().min(1), // non-empty string
  timestamp: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/,
      "Invalid ISO 8601 datetime",
    ),
  altitude: z.number().positive(),
  velocity: z.number().positive(),
  status: z.enum(statusArray),
});

export const TelemetryArray = z.array(TelemetrySchema);
