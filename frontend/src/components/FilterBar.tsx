import { TextField, Stack } from "@mui/material";
import { TelemetryFilters } from "../types/telemetry";

type Props = {
  setFilters: (filters: TelemetryFilters) => void;
};

const FilterBar: React.FC<Props> = ({ setFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ mt: 2 }}>
      <TextField
        label="Filter by Satellite ID"
        name="satelliteId"
        onChange={handleChange}
      />
      <TextField
        label="Filter by Status"
        name="status"
        onChange={handleChange}
      />
    </Stack>
  );
};

export default FilterBar;
