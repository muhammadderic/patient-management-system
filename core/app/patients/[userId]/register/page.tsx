import Image from "next/image";

import { getUser } from "@/lib/actions";
import { RegisterForm } from "@/components/forms";

const Register = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params; 
  console.log("userId: ", userId)
  const user = await getUser(userId); 

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
            loading="eager"
          />

          <RegisterForm user={user}/>

          <p className="copyright py-12">© 2024 patient-management-system</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
        loading="eager"
      />
    </div>
  );
};

export default Register;