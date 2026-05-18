export const dynamic = "force-dynamic";

import Loader from "@/components/common/loader/Loader";
import { Suspense } from "react";
import VerifyOtpClient from "./VerifyOtpClient";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <VerifyOtpClient />
    </Suspense>
  );
}