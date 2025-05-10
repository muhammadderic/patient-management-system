import { 
  Control, 
  Controller, 
  FieldValues, 
  Path 
} from "react-hook-form";
import { LucideIcon } from "lucide-react";

import { 
  Field, 
  FieldLabel, 
  FieldError 
} from "./ui/field";
import { Input } from "./ui/input";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface BaseFieldConfig {
  name: string;
  fieldType: FormFieldType;
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderSkeleton?: (field: any) => React.ReactNode;
}

// Combining type with the strict React Hook Form generics for the main component
interface CustomProps<T extends FieldValues> extends BaseFieldConfig {
  control: Control<T>;
  name: Path<T>;
}

const RenderInput = ({ 
  field, 
  props, 
  isInvalid 
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any; 
  props: BaseFieldConfig; 
  isInvalid: boolean 
}) => {
  const { icon: Icon } = props;

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex items-center rounded-md border border-dark-500 bg-dark-400">
          {Icon && (
            <Icon className="ml-2 h-5 w-5 text-dark-600 shrink-0" />
          )}
          <Input
            placeholder={props.placeholder}
            {...field}
            aria-invalid={isInvalid}
            className="shad-input border-0"
          />
        </div>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

export const CustomFormField = <T extends FieldValues>(props: CustomProps<T>) => {
  const { control, name, label, fieldType } = props;

  return (
    <Controller
      control={control as unknown as Control<FieldValues>}
      name={name}
      render={({ field, fieldState }) => {
        const isInvalid = !!fieldState.error;

        return (
          <Field data-invalid={isInvalid} className="flex-1">
            {fieldType !== FormFieldType.CHECKBOX && label && (
              <FieldLabel className="shad-input-label">{label}</FieldLabel>
            )}
            
            <RenderInput field={field} props={props} isInvalid={isInvalid} />

            <FieldError className="shad-error">
              {fieldState.error?.message}
            </FieldError>
          </Field>
        );
      }}
    />
  );
};