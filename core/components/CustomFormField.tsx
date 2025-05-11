import { 
  Control, 
  Controller, 
  FieldValues, 
  Path 
} from "react-hook-form";
import { CalendarFold, LucideIcon } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import ReactDatePicker from "react-datepicker";

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
    case FormFieldType.PHONE_INPUT:
      return (
        <div className="phone-input-wrapper">
          <PhoneInput
            defaultCountry="US"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            aria-invalid={isInvalid}
            disabled={props.disabled}
          />
        </div>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <div className="flex items-center justify-center">
            <CalendarFold className="ml-2 h-5 w-5 text-dark-600 shrink-0" />
          </div>
          <ReactDatePicker
            showTimeSelect={props.showTimeSelect ?? false}
            selected={field.value}
            onChange={(date: Date | null) => field.onChange(date)}
            timeInputLabel="Time:"
            dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
            wrapperClassName="date-picker"
            aria-invalid={isInvalid ? "true" : "false"} 
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