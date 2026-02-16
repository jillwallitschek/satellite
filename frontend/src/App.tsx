import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

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
      {loading && (
        <Box
          sx={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <CircularProgress sx={{ transform: "scale(2.5)" }} />
        </Box>
      )}

      <Container>
        <Typography variant="h4" sx={{ mt: 4 }}>
          Satellite Telemetry Dashboard
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TelemetryForm onSuccess={fetchTelemetry} />

        <TelemetryTable
          telemetry={telemetry}
          beforeDelete={() => {
            setLoading(true);
          }}
          afterDelete={fetchTelemetry}
        />
      </Container>
    </CustomThemeProvider>
  );
}

export default App;
