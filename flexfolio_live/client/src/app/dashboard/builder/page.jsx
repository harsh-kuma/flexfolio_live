"use client";

import PortfolioEditor from "@/components/builder/PortfolioEditor";
import Loader from "@/components/common/loader/Loader";
import DashboardPortfolioNotFound from "@/components/dashboard/layout/portfolio/DashboardPortfolioNotFound";
import { useAuth } from "@/components/providers/AuthProvider";
import { getGenerateSiteDataById } from "@/lib/api";
import { verifyTemplate } from "@/lib/verifyTemplate";
import { templates } from "@/utils/templates";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function BuilderForm() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("template");
  const generateAiId = params.get("generatedAiSlug");
  const { user, loading } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isValidTemplate = verifyTemplate(type);
  const category = isValidTemplate ? type.split("~")[0] : null;

  const template = isValidTemplate ? templates[category] : null;
  const [loadingAi, setLoadingAi] = useState(false);
  const [initialData, setInitialData] = useState(template?.defaultData);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/login");
    } else {
      setCheckingAuth(false);
    }
  }, [user, loading, router]);


  useEffect(() => {
    if (!generateAiId) {
      setInitialData(template.defaultData);
      return;
    }
    const loadAiData = async () => {
      try {
        setLoadingAi(true);
        const res = await getGenerateSiteDataById(generateAiId);
        if (res.success) {
          setInitialData(res.data);
        } else {
          setInitialData(template.defaultData);
        }
      } catch (err) {
        console.error(err);
        setInitialData(template.defaultData);
      } finally {
        setLoadingAi(false);
      }
    };

    loadAiData();
  }, [generateAiId, template]);


  if (checkingAuth || loading || loadingAi) {
    return <Loader />;
  }

  if (!isValidTemplate) {
    return (
      <div>
        <DashboardPortfolioNotFound />
      </div>
    );
  }

  return (
    <PortfolioEditor mode="create" templateKey={type} initialData={initialData}
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