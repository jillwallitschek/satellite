import axios from "axios";
import { Telemetry, TelemetryFilters, Response } from "./types/telemetry";
import { TelemetryArray, TelemetrySchema } from "./schemas/telemetry";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//@TODO: need to setup unit tests

/**
 * retrieve all telemetry data
 *
 * @param params - optional params to filter by
 * @returns - response
 */
export const getTelemetry = async (
  params?: TelemetryFilters,
): Promise<Response<Telemetry[]>> => {
  const response = await API.get("/telemetry", { params });
  if (response.status !== 200) {
    return {
      success: false,
      message: "Failed to obtain telemetry data",
    };
  }
  //.items if paginated were requested in params, not supported yet
  const parsed = TelemetryArray.safeParse(response.data.items ?? response.data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid response format",
    };
  }
  return {
    success: true,
    data: parsed.data,
  };
};

/**
 * add telemetry data to the database
 *
 * @param data - telemetry data
 * @returns - response
 */
export const addTelemetry = async (
  data: Omit<Telemetry, "id">,
): Promise<Response<Telemetry>> => {
  const response = await API.post("/telemetry", data);
  if (response.status !== 201) {
    return {
      success: false,
      message: "Failed to add telemetry data",
    };
  }
  const parsed = TelemetrySchema.safeParse(response.data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid response format",
    };
  }
  return {
    success: true,
    data: parsed.data,
  };
};

/**
 * Permanently deletes telemetry data in the database
 *
 * @param id - uuid of telemetry data
 * @returns - response
 */
export const deleteTelemetry = async (id: string): Promise<Response<null>> => {
  const response = await API.delete(`/telemetry/${id}`);
  if (response.status !== 204) {
    return {
      success: false,
      message: "Failed to delete telemetry data",
    };
  }
  return {
    success: true,
    data: null,
  };
};
