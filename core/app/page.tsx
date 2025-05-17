import Image from "next/image";
import Link from "next/link";

import { PatientForm } from "@/components/forms";
import { PasskeyModal } from "@/components/PasskeyModal";

interface Props {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const isAdmin = params?.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      {/* OTP Verivication / PasskeyModal */}
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <div className="mb-2 w-fit rounded-full bg-white p-1 shadow-sm">
            <Image
              src="/assets/icons/logo-full.svg"
              height={40}
              width={40}
              alt="patient"
              className="h-10 w-auto"
              loading="eager"
            />
          </div>

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 PatientManagementSystem
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Right side image */}
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
        loading="eager"
      />
    </div>
  );
}
