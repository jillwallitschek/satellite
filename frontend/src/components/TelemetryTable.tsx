import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Telemetry } from "../types/telemetry";
import { deleteTelemetry } from "../api";
import CustomTable from "./CustomTable";
import { useState } from "react";
import CustomModal from "./CustomModal";

type Props = {
  telemetry: Telemetry[];
  beforeDelete: () => void;
  afterDelete: () => Promise<void>;
};

/**
 * A table that displays telemetry data
 * @param props
 * @returns
 */
export default function TelemetryTable({
  telemetry,
  beforeDelete,
  afterDelete,
}: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Telemetry | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    beforeDelete();
    const response = await deleteTelemetry(deleteTarget.id);
    if (!response.success) {
      setDeleteError(response.message);
    } else {
      setDeleteTarget(null);
    }
    afterDelete();
  };

  return (
    <>
      <CustomModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        dialogTitle={`Delete ${deleteTarget?.satelliteId ?? "this telemetry"}`}
        dialogContentText="Are you sure you want to delete this entry? This action cannot be
            undone."
        actionButtonText="Delete"
        onAction={handleDelete}
        error={deleteError}
        closeButtonText="Cancel"
      />
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
        defaultOrderDirection="asc"
        rows={telemetry.map((t) => ({
          ...t,
          rowId: t.id,
          actions: (
            <IconButton onClick={() => setDeleteTarget(t)}>
              <DeleteIcon />
            </IconButton>
          ),
        }))}
      />
    </>
  );
}
