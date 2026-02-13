export type Telemetry = {
  id: string;
  satelliteId: string;
  timestamp: string;
  altitude: number;
  velocity: number;
  status: "healthy" | "critical";
};

export type TelemetryFilters = {
  satelliteId?: string;
  status?: string;
};
