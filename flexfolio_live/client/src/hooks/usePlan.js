import { useAuth } from "@/components/providers/AuthProvider";
import { PLAN_FEATURES } from "@/constants/planFeatures";

export const usePlan = () => {
  const { user } = useAuth();

  const plan = user?.subscription?.plan || "free";
  const usage = user?.usage || {};

  const features = PLAN_FEATURES[plan] || PLAN_FEATURES.free;

  const canCreatePortfolio = () => {
    const limit = features.maxPortfolios;

    if (limit === -1) {
      return true;
    }

    return usage.portfolios < limit;
  };

  const canAddDomain = () => {
    const limit = features.maxDomains;

    if (limit === -1) {
      return true;
    }

    return usage.domains < limit;
  };

  return {
    user,
    plan,
    usage,
    features,
    canCreatePortfolio,
    canAddDomain,
  };
};