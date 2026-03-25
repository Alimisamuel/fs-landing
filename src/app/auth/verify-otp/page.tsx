import GlobalLoading from "@/app/loading";
import VerifyOtpPage from "@/features/Auth/VerifyOtpPage";


import { Suspense } from "react";

const Verify = () => {
  return (
    <>
      <Suspense fallback={<GlobalLoading />}>
        <VerifyOtpPage />
      </Suspense>
    </>
  );
};

export default Verify;
