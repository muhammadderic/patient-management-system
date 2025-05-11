"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, User } from "lucide-react";

import { PatientFormDefaultValues } from "@/constants";
import { PatientFormValidation } from "@/lib";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";

import { CustomFormField, FormFieldType } from "../CustomFormField";
import { SubmitButton } from "../SubmitButton";

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: { ...PatientFormDefaultValues },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    console.log("HIT")
    setIsLoading(true);

    try {
      const patient = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        // birthDate: new Date(values.birthDate),
        // birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument,
        privacyConsent: values.privacyConsent,
      };

      console.log(patient)
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 space-y-12"
    >
      <section className="space-y-4">
        <h1 className="header">Welcome 👋</h1>
        <p className="text-dark-700">Let us know more about yourself.</p>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Personal Information</h2>
        </div>

        {/* NAME */}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={control}
          name="name"
          placeholder="John Doe"
          icon={User}
        />

        {/* EMAIL & PHONE */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="email"
            label="Email address"
            placeholder="johndoe@gmail.com"
            icon={Mail}
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={control}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* BirthDate & Gender */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <p>BIRTH DATE</p>

          <p>GENDER</p>
        </div>

        {/* Address & Occupation */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="address"
            label="Address"
            placeholder="14 street, New york, NY - 5101"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="occupation"
            label="Occupation"
            placeholder=" Software Engineer"
          />
        </div>

        {/* Emergency Contact Name & Emergency Contact Number */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Guardian's name"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={control}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder="(555) 123-4567"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Medical Information</h2>
        </div>

        {/* PRIMARY CARE PHYSICIAN */}
        <p>PRIMARY PHYSICIAN</p>

        {/* INSURANCE & POLICY NUMBER */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="BlueCross BlueShield"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="ABC123456789"
          />
        </div>

        {/* ALLERGY & CURRENT MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <p>ALLERGIES</p>

          <p>CURRENT MEDICATIONS</p>
        </div>

        {/* FAMILY MEDICATION & PAST MEDICATIONS */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <p>FAMILY MEDICAL HISTORY</p>

          <p>PAST MEDICAL HISTORY</p>
        </div>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Identification and Verfication</h2>
        </div>

        <p>IDENTIFICATION TYPE</p>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
        />

        <p>IDENTIFICATION DOCUMENT</p>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
        </div>

        <p>TREATMENT CONSENT</p>

        <p>DISCLOSURE CONSENT</p>

        <p>PRIVACY CONSENT</p>
      </section>

      <SubmitButton isLoading={isLoading}>
        Submit and Continue
      </SubmitButton>
    </form>
  );
};