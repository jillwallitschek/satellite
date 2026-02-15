import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Telemetry } from "../types/telemetry";
import { deleteTelemetry } from "../api";
import CustomTable from "./CustomTable";

type Props = {
  telemetry: Telemetry[];
  onDelete: () => void;
};

/**
 * A table that displays telemetry data
 * @param props
 * @returns
 */
export default function TelemetryTable({ telemetry, onDelete }: Props) {
  const handleDelete = async (id: string) => {
    await deleteTelemetry(id);
    onDelete();
  };

  return (
    <CustomTable
      headerCells={[
        {
          id: "satelliteId",
          dataType: "string",
          label: "Satellite id",
        },
        {
          id: "timestamp",
          dataType: "date",
          label: "Timestamp",
        },
        {
          id: "altitude",
          dataType: "number",
          label: "Altitude",
        },
        {
          id: "velocity",
          dataType: "number",
          label: "Velocity",
        },
        {
          id: "status",
          dataType: "string",
          label: "Health",
        },
        {
          id: "actions",
          dataType: "reactNode",
          label: "",
        },
      ]}
      defaultOrder="satelliteId"
      defaultOrderDirection="desc"
      rows={telemetry.map((t) => ({
        ...t,
        rowId: t.id,
        actions: (
          <IconButton onClick={() => handleDelete(t.id)}>
            <DeleteIcon />
          </IconButton>
        ),
      }))}
    ></CustomTable>
  );
}
