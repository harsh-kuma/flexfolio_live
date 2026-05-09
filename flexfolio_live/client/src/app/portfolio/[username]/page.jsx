import { getPortfolio } from "@/lib/api";
import { templates } from "@/lib/templates";

export default async function PortfolioPage({ params }) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    return (
      <div className="text-center mt-10 text-xl">
        Portfolio Not Found
      </div>
    );
  }

  const template = templates[portfolio.templateKey];

  if (!template) {
    return (
      <div className="text-center mt-10 text-xl">
        Template Not Found
      </div>
    );
  }

  // Dynamic component
  const TemplateComponent = template.component;
  return (
    <TemplateComponent data={portfolio.data} />
  );
}