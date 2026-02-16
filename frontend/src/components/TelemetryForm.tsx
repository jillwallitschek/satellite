import { addTelemetry } from "../api";
import CustomFormModal from "./forms/CustomFormModal";
import { TelemetrySchema } from "../schemas/telemetry";
import { getInputs } from "./forms/inputs";
import { isValidDate } from "../utils/date";

type Props = {
  beforeCreate: () => void;
  afterCreate: () => Promise<void>;
};

const isPositive = (val: string | undefined) => {
  const num = Number(val);
  if (isNaN(num)) return false;
  return num > 0;
};

const inputs = getInputs([
  {
    id: "satelliteId",
    inputType: "string",
    label: "Satellite id",
    invalid: (value) => {
      const parse = TelemetrySchema.shape.satelliteId.safeParse(value);
      return parse.success
        ? { invalid: false }
        : { invalid: true, message: "Enter any id" };
    },
  },
  {
    id: "timestamp",
    inputType: "date",
    label: "Timestamp",
    invalid: (value) => {
      return isValidDate(value as string)
        ? { invalid: false }
        : { invalid: true, message: "Enter any date" };
    },
  },
  {
    id: "altitude",
    inputType: "number",
    label: "Altitude",
    invalid: (value) => {
      const isPositiveNumber = isPositive(value);
      return isPositiveNumber
        ? { invalid: false }
        : { invalid: true, message: "Enter a positive number" };
    },
  },
  {
    id: "velocity",
    inputType: "number",
    label: "Velocity",
    invalid: (value) => {
      const isPositiveNumber = isPositive(value);
      return isPositiveNumber
        ? { invalid: false }
        : { invalid: true, message: "Enter a positive number" };
    },
  },
  {
    id: "status",
    inputType: "string",
    defaultValue: "healthy",
    label: "Health",
    invalid: (value) => {
      if (!value || !["critical", "healthy"].includes(value as string)) {
        return {
          invalid: true,
          message: "Enter 'healthy' or 'critical'",
        };
      }
      return { invalid: false };
    },
  },
] as const);

/**
 * A modal that when open allows you to add new telemetry data
 * @param props
 * @returns react modal
 */
export default function TelemetryFormModal({
  beforeCreate,
  afterCreate,
}: Props) {
  return (
    <CustomFormModal
      dialogTitle="Add telemetry data"
      onSubmitButtonText="Create"
      openDialogButtonText="Add"
      beforeSubmit={beforeCreate}
      afterSubmit={afterCreate}
      onSubmit={async (formResponse) => {
        const data = formResponse.reduce(
          (acc, input) => {
            return { ...acc, [input.id]: input.value };
          },
          {} as Record<(typeof inputs)[number]["id"], string>,
        );
        const response = await addTelemetry(data);
        return response.success ? { ...response, data: null } : response;
      }}
      inputs={inputs}
    />
  );
}
