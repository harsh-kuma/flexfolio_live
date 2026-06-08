"use client";

import PortfolioEditor from "@/components/builder/PortfolioEditor";
import Loader from "@/components/common/loader/Loader";
import DashboardPortfolioNotFound from "@/components/dashboard/layout/portfolio/DashboardPortfolioNotFound";
import { getPortfolioById } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPortfolioPage() {
  const params = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio =
    async () => {
      try {
        const res =
          await getPortfolioById(
            params.id
          );

        setPortfolio(
          res.portfolio
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return <Loader />;
  }

  if (!portfolio) {
    return (
      <DashboardPortfolioNotFound />
    );
  }

  return (
    <PortfolioEditor mode="edit" portfolioId={portfolio._id} templateKey={portfolio.templateKey} initialData={portfolio.data}
    />
  );
}