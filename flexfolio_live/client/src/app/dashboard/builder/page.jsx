"use client";

import PortfolioEditor from "@/components/builder/PortfolioEditor";
import Loader from "@/components/common/loader/Loader";
import DashboardPortfolioNotFound from "@/components/dashboard/layout/portfolio/DashboardPortfolioNotFound";
import { useAuth } from "@/components/providers/AuthProvider";
import { verifyTemplate } from "@/lib/verifyTemplate";
import { templates } from "@/utils/templates";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function BuilderForm() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("template");
  const { user,loading} = useAuth();
  const [ checkingAuth,setCheckingAuth] = useState(true);

  const isValidTemplate = verifyTemplate(type);
  const category = isValidTemplate? type.split("~")[0]: null;

  const template = isValidTemplate? templates[category]: null;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(
        "/auth/login"
      );
    } else {
      setCheckingAuth(false);
    }
  }, [user,loading,router]);

  if (checkingAuth ||loading) {
    return <Loader />;
  }

  if (!isValidTemplate) {
    return (
      <div>
        <DashboardPortfolioNotFound/>
      </div>
    );
  }

  return (
    <PortfolioEditor mode="create" templateKey={type} initialData={template.defaultData}
    />
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<Loader />}>
      <BuilderForm />
    </Suspense>
  );
}