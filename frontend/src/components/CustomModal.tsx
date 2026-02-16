import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Alert } from "@mui/material";
import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onAction: () => Promise<void>;
  closeButtonText: string;
  dialogTitle: string;
  dialogContent: React.ReactNode;
  actionButtonText: string;
  error: string | null;
};

/**
 * A custom modal that performs an action
 * @param props
 * @returns - react modal
 */
export default function CustomModal({
  open,
  onClose,
  onAction,
  closeButtonText,
  actionButtonText,
  dialogTitle,
  dialogContent,
  error,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>

        <DialogContent>
          <DialogContentText>{dialogContent}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{closeButtonText}</Button>
          <Button
            onClick={async () => {
              if (loading) return;
              setLoading(true);
              await onAction();
              setLoading(false);
            }}
            color="error"
            variant="contained"
          >
            {actionButtonText}
          </Button>
        </DialogActions>
        {error && (
          //@TODO: switch away from alert
          <Alert severity="error" sx={{ mt: 2, background: "transparent" }}>
            {error}
          </Alert>
        )}
      </Dialog>
    </>
  );
}
