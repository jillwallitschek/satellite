import { TelemetrySchema } from "@/schemas/telemetry";
import { z } from "zod";

/**
 * a telemetry object type that matches the backend
 */
export type Telemetry = z.infer<typeof TelemetrySchema>;

/**
 * filter options for querying telemetry data
 */
export type TelemetryFilters = {
  satelliteId?: string;
  status?: SatelliteStatus;
};

/**
 * allowed satellite statuses
 */
export type SatelliteStatus = "healthy" | "critical";

/**
 * response type for api calls
 */
export type Response<T> =
  | {
      success: true;
      data: T;
      message?: undefined;
    }
  | {
      success: false;
      data?: undefined;
      message: string;
    };
