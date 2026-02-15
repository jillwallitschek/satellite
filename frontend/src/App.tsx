import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";

import { Telemetry } from "./types/telemetry";
import { getTelemetry } from "./api";
import TelemetryTable from "./components/TelemetryTable";
import TelemetryForm from "./components/TelemetryForm";
import CustomThemeProvider from "./theme/CustomThemeProvider";

function App() {
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTelemetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTelemetry(); //@TODO: restore filters?
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
  }, []);

  return (
    <CustomThemeProvider>
      <Container>
        <Typography variant="h4" sx={{ mt: 4 }}>
          Satellite Telemetry Dashboard
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TelemetryForm onSuccess={fetchTelemetry} />

        {loading && <CircularProgress />}

        <TelemetryTable telemetry={telemetry} onDelete={fetchTelemetry} />
      </Container>
    </CustomThemeProvider>
  );
}

export default App;
