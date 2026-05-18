export const dynamic = "force-dynamic";

import Loader from "@/components/common/loader/Loader";
import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
  return (
    <Suspense fallback={<Loader/>}>
      <ResetPasswordClient />
    </Suspense>
  );
}