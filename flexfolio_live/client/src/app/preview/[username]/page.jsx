export const dynamic = "force-dynamic";

import PortfolioNotFound from "@/components/portfolio/PortfolioNotFound";
import TemplateNotFound from "@/components/portfolio/TemplateNotFound";
import { getPreviewPortfolio } from "@/lib/serverApi";
import { templates } from "@/lib/templates";

export default async function PortfolioPage({ params }) {
  const { username } = await params;

  const res = await getPreviewPortfolio(username);
  const portfolio = res.portfolio;

  if (!portfolio) {
    return <PortfolioNotFound />;
  }

  const template = templates[portfolio.templateKey];

  if (!template) {
    return <TemplateNotFound />;
  }

  const TemplateComponent = template.component;

  return (
    <TemplateComponent data={portfolio.data} owner_key={portfolio._id} working={true}/>
  );
}