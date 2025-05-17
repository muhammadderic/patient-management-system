"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Doctors } from "@/constants";
import { getAppointmentSchema } from "@/lib";
import { createAppointment, updateAppointment } from "@/lib/actions";
import { Appointment } from "@/types/appwrite.types";

import { CustomFormField, FormFieldType } from "../CustomFormField";
import { SelectItem } from "../ui/select";
import { SubmitButton } from "../SubmitButton";

interface AppointmentFormProps {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: AppointmentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialDate] = useState(() => new Date(Date.now()));

  const AppointmentFormValidation = getAppointmentSchema(type);
  
  const { control, handleSubmit, reset } = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule)
        : initialDate,
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        }

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        if (!appointment?.$id) {
          console.error("Cannot update appointment without an appointmentId");
          return;
        }

        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          setOpen && setOpen(false);
          reset();
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6">
      {type === "create" && (
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds.
          </p>
        </section>
      )}

      {type !== "cancel" && (
        <>
          {/* Primary Physician */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                    loading="eager"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          {/* Schedule */}
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={control}
            name="schedule"
            label="Expected appointment date"
            showTimeSelect
            dateFormat="MM/dd/yyyy  -  h:mm aa"
          />

          <div className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}>
            {/* Appointment Reason */}
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={control}
              name="reason"
              label="Appointment reason"
              placeholder="Annual montly check-up"
              disabled={type === "schedule"}
            />

            {/* Notes */}
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={control}
              name="note"
              label="Comments/notes"
              placeholder="Prefer afternoon appointments, if possible"
              disabled={type === "schedule"}
            />
          </div>
        </>
      )}

      {type === "cancel" && (
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={control}
          name="cancellationReason"
          label="Reason for cancellation"
          placeholder="Urgent meeting came up"
        />
      )}

      <SubmitButton
        isLoading={isLoading}
        className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
      >
        {buttonLabel}
      </SubmitButton>
    </form>
  )
}