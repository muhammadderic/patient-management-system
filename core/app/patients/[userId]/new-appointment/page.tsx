import Image from "next/image";

import { AppointmentForm } from "@/components/forms";
import { getPatient } from "@/lib/actions";

type Props = {
  params: Promise<{ userId: string }>;
};

const Appointment = async ({ params }: Props) => {
  const { userId } = await params;
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
            loading="eager"
          />

          <AppointmentForm 
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2026 patient-management-system</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
        loading="eager"
      />
    </div>
  )
}

export default Appointment;