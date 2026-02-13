import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { Telemetry } from "../types/telemetry";
import { addTelemetry } from "../api";

type Props = {
  onSuccess: () => void;
};

const TelemetryForm: React.FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = useState<Omit<Telemetry, "id">>({
    satelliteId: "",
    timestamp: "",
    altitude: 0,
    velocity: 0,
    status: "healthy"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "altitude" || name === "velocity" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTelemetry(form);
    onSuccess();
    setForm({
      satelliteId: "",
      timestamp: "",
      altitude: 0,
      velocity: 0,
      status: "healthy"
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ mt: 2 }}>
        <TextField
          label="Satellite ID"
          name="satelliteId"
          value={form.satelliteId}
          onChange={handleChange}
          required
        />
        <TextField
          type="datetime-local"
          name="timestamp"
          value={form.timestamp}
          onChange={handleChange}
          required
        />
        <TextField
          type="number"
          label="Altitude"
          name="altitude"
          value={form.altitude}
          onChange={handleChange}
          required
        />
        <TextField
          type="number"
          label="Velocity"
          name="velocity"
          value={form.velocity}
          onChange={handleChange}
          required
        />
        <TextField
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained">Add</Button>
      </Stack>
    </form>
  );
};

export default TelemetryForm;
