import axios from "axios";
import { Telemetry, TelemetryFilters } from "./types/telemetry";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

console.log(import.meta.env.VITE_API_URL)

export const getTelemetry = async (
  params?: TelemetryFilters
): Promise<Telemetry[]> => {
  console.log('hahah')
  const response = await API.get("/telemetry", { params });
  console.log('jill3')
  console.log(response)
  return response.data.items ?? response.data;
};

export const addTelemetry = async (
  data: Omit<Telemetry, "id">
): Promise<Telemetry> => {
  const response = await API.post("/telemetry", data);
  return response.data;
};

export const deleteTelemetry = async (id: string): Promise<void> => {
  await API.delete(`/telemetry/${id}`);
};
