import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions";
import { formatDateTime } from "@/lib/utils";

type Props = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string }>;
};

const RequestSuccess = async ({ params, searchParams }: Props) => {
  const { userId } = await params;
  const { appointmentId } = await searchParams;
  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
            loading="eager"
          />
        </Link>

        <section className="flex flex-col items-center">
         <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
            loading="eager"
            style={{ height: 'auto', width: 'auto' }}
            className="max-w-[280px]"
          />

          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>

          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details: </p>
          <div className="flex items-center gap-3">
            {doctor?.image && (
              <Image
                src={doctor.image}
                alt={doctor.name ?? "doctor"}
                width={100}
                height={100}
                className="size-6"
                loading="eager"
              />
            )}
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>

          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
              loading="eager"
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default RequestSuccess;