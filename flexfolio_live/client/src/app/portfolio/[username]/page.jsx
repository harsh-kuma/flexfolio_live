export const dynamic = "force-dynamic";
import { getPortfolio } from "@/lib/api";
import { templates } from "@/lib/templates";

import PortfolioAnalytics from "@/components/analytics/PortfolioAnalytics";
import PortfolioNotFound from "@/components/portfolio/PortfolioNotFound";
import TemplateNotFound from "@/components/portfolio/TemplateNotFound";

export async function generateMetadata({ params }) {
  const { username } = await params;

  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    return {
      title: "Portfolio Not Found",
    };
  }

  const data = portfolio.data;

  return {
    title: `${data?.fullName || "flexfolio"} - ${data?.title || "Portfolio"}`,

    description:
      data?.bio ||
      data?.about ||
      `Explore ${data?.fullName}'s portfolio.`,

    keywords: [
      data?.fullName,
      data?.title,
      "portfolio",
      "developer portfolio",
      "web developer",
      "software engineer",
    ],

    openGraph: {
      title: `${data?.fullName} Portfolio`,
      description:
        data?.bio ||
        data?.about ||
        `Explore ${data?.fullName}'s portfolio.`,
      images: [
        {
          url: data?.image?.url || "/default-og.png",
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${data?.fullName} Portfolio`,
      description:
        data?.bio ||
        data?.about ||
        `Explore ${data?.fullName}'s portfolio.`,
      images: [data?.image?.url || "/default-og.png"],
    },

    icons: {
      icon: data?.image?.url || "/favicon.ico",
    },

    alternates: {
      canonical: `https://flexfolio-live.vercel.app/portfolio/${username}`,
    },
  };
}

export default async function PortfolioPage({ params }) {
  const { username } = await params;

  const portfolio = await getPortfolio(username);

  if (!portfolio?.data) {
    return <PortfolioNotFound />;
  }

  const template = templates[portfolio.templateKey];

  if (!template) {
    return <TemplateNotFound />;
  }

  const TemplateComponent = template.component;

  return (
    <>
      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: portfolio?.data?.fullName,
            jobTitle: portfolio?.data?.title,
            image: portfolio?.data?.image?.url,
            email: portfolio?.data?.email,
            sameAs: [
              portfolio?.data?.github,
              portfolio?.data?.linkedin,
            ].filter(Boolean),
          }),
        }}
      />
      {portfolio?.features?.analytics && <PortfolioAnalytics portfolioId={String(portfolio?._id)} />}
      <TemplateComponent data={portfolio.data} owner_key={portfolio._id} working={true} system_allow={portfolio.features} />
    </>
  );
}