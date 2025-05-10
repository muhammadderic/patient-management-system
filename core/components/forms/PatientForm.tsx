"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Mail, User } from "lucide-react";

import { UserFormValidation } from "@/lib";
import { createUser } from "@/lib/actions";

import { CustomFormField, FormFieldType } from "../CustomFormField";
import { SubmitButton } from "../SubmitButton";

export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const { control, handleSubmit } = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6">
      <section className="mb-12 space-y-4">
        <h1 className="header">Hi there 👋</h1>
        <p className="text-dark-700">Get started with appointments.</p>
      </section>

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={control}
        name="name"
        label="Full name"
        placeholder="John Doe"
        icon={User}
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={control}
        name="email"
        label="Email"
        placeholder="johndoe@gmail.com"
        icon={Mail}
      />

      <CustomFormField
        fieldType={FormFieldType.PHONE_INPUT}
        control={control}
        name="phone"
        label="Phone number"
        placeholder="(555) 123-4567"
      />

      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  )
}