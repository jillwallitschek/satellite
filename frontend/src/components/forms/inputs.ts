export type InputDataTypes = "string" | "date" | "number";

export type CustomInput<TData extends InputDataTypes, TId extends string> = {
  id: TId;
  label: string;
  invalid: (value: string | undefined) => Invalid;
  defaultValue?: string;
  inputType: TData;
};

export type Invalid =
  | {
      invalid: true;
      message: string;
    }
  | {
      invalid: false;
      message?: undefined;
    };

/**
 * input array generator
 * @param inputs
 * @returns - a strongly typed array of inputs
 */
export function getInputs<T extends CustomInput<InputDataTypes, string>[]>(
  inputs: T,
): T {
  return inputs;
}
