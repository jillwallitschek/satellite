import {
  Table, TableHead, TableRow, TableCell,
  TableBody, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Telemetry } from "../types/telemetry";
import { deleteTelemetry } from "../api";

type Props = {
  telemetry: Telemetry[];
  onDelete: () => void;
};

const TelemetryTable: React.FC<Props> = ({ telemetry, onDelete }) => {
  const handleDelete = async (id: string) => {
    await deleteTelemetry(id);
    onDelete();
  };

  return (
    <Table sx={{ mt: 4 }}>
      <TableHead>
        <TableRow>
          <TableCell>Satellite ID</TableCell>
          <TableCell>Timestamp</TableCell>
          <TableCell>Altitude</TableCell>
          <TableCell>Velocity</TableCell>
          <TableCell>Status</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {telemetry.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.satelliteId}</TableCell>
            <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
            <TableCell>{row.altitude}</TableCell>
            <TableCell>{row.velocity}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>
              <IconButton onClick={() => handleDelete(row.id)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TelemetryTable;
