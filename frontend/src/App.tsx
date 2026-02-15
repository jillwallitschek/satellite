import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";

import { Telemetry, TelemetryFilters } from "./types/telemetry";
import { getTelemetry } from "./api";
import TelemetryTable from "./components/TelemetryTable";
import TelemetryForm from "./components/TelemetryForm";
import FilterBar from "./components/FilterBar";

//@TODO: set a mui layout/theme

function App() {
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [filters, setFilters] = useState<TelemetryFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTelemetry(filters);
      setTelemetry(response.data ?? []);
      if (!response.success) setError(response.message);
    } catch {
      setError("Failed to fetch telemetry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [filters]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        Satellite Telemetry Dashboard
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <FilterBar setFilters={setFilters} />
      <TelemetryForm onSuccess={fetchTelemetry} />

      {loading && <CircularProgress />}

      <TelemetryTable telemetry={telemetry} onDelete={fetchTelemetry} />
    </Container>
  );
}

export default App;
