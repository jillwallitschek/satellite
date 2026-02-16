import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import CustomModal from "../CustomModal";
import { Response } from "@/types/telemetry";
import type { CustomInput, InputDataTypes, Invalid } from "./inputs";

type Props<T extends CustomInput<InputDataTypes, string>[]> = {
  beforeSubmit: () => void;
  afterSubmit: () => Promise<void>;
  onSubmit: (form: FormResponse<T>) => Promise<Response<null>>;
  onSubmitButtonText: string;
  openDialogButtonText: string;
  dialogTitle: string;
  inputs: T;
};

type InvalidWithId = Invalid & { id: string };

type FormResponse<T extends readonly CustomInput<InputDataTypes, string>[]> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends CustomInput<any, any>
    ? {
        id: T[K]["id"];
        value: string;
      }
    : never;
};

/**
 * A modal that when open allows you to add new telemetry data
 * @param props
 * @returns react modal
 */
export default function CustomFormModal<
  T extends CustomInput<InputDataTypes, string>[],
>({
  inputs,
  beforeSubmit,
  afterSubmit,
  onSubmit,
  onSubmitButtonText,
  openDialogButtonText,
  dialogTitle,
}: Props<T>) {
  const defaults = inputs.map((i) => ({
    id: i.id,
    value: i.defaultValue,
  })) as FormResponse<T>;
  const [partialInputs, setPartialInputs] = useState<FormResponse<T>>(defaults);
  const [touched, setTouched] = useState(
    inputs.map((i) => ({ id: i.id, touched: false })),
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getValue = (id: T[number]["id"]) =>
    partialInputs.find((pi) => pi.id === id)?.value;

  const getInvalids = (onlyCheckTouched: boolean): InvalidWithId[] => {
    const inputsToCheck = onlyCheckTouched
      ? inputs.filter((i) => touched.find((t) => t.id === i.id)?.touched)
      : inputs;
    return inputsToCheck
      .map((i) => ({ id: i.id, ...i.invalid(getValue(i.id)) }))
      .filter((i) => i.invalid);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPartialInputs(defaults);
    setTouched(inputs.map((i) => ({ id: i.id, touched: false })));
    setError(null);
  };

  const handleSubmit = async () => {
    const allTouched = touched.map((t) => ({ id: t.id, touched: true }));
    setTouched(allTouched);
    beforeSubmit();
    const finalInvalids = getInvalids(false);
    if (finalInvalids.length) {
      setError("Correct the invalid inputs");
    } else {
      const response = await onSubmit(partialInputs);
      if (!response.success) {
        setError(response.message);
      } else {
        handleClose();
      }
    }
    afterSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const newValues = [
      ...partialInputs.filter((i) => i.id !== id),
      { id, value },
    ];
    setPartialInputs(newValues as FormResponse<T>);
    const newTouched = [
      ...touched.filter((i) => i.id !== id),
      { id, touched: true },
    ];
    setTouched(newTouched);
  };

  const currentInvalids = getInvalids(true);

  const formComponent = (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmit();
      }}
    >
      <Stack spacing={2} direction={{ xs: "column" }} sx={{ mt: 2 }}>
        {inputs.map((i) => {
          const inputError = currentInvalids.find(
            (ci) => ci.id === i.id,
          )?.message;
          const currentValue = getValue(i.id);
          return (
            <TextField
              InputLabelProps={{ shrink: true }}
              type={
                i.inputType === "date"
                  ? "datetime-local"
                  : i.inputType === "number"
                    ? "number"
                    : "text"
              }
              label={i.label}
              key={i.id}
              id={i.id}
              value={currentValue}
              onChange={handleChange}
              error={!!inputError}
              helperText={inputError}
              required
            />
          );
        })}
      </Stack>
    </form>
  );

  return (
    <>
      <CustomModal
        open={isOpen}
        onClose={handleClose}
        dialogTitle={dialogTitle}
        dialogContent={formComponent}
        actionButtonText={onSubmitButtonText}
        onAction={handleSubmit}
        error={error}
        closeButtonText="Cancel"
      />
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        {openDialogButtonText}
      </Button>
    </>
  );
}
