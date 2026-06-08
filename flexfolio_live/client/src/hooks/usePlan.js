import { useAuth } from "@/components/providers/AuthProvider";

export const usePlan = () => {
  const { user } = useAuth();

  const plan = user?.subscription?.plan || "free";
  const usage = user?.usage || {};

  const limits = {
    free: {
      maxPortfolios: 2,
    },
    pro: {
      maxPortfolios: -1,
    }
  };

  const canCreatePortfolio = () => {
    const limit = limits[plan].maxPortfolios;
    if (limit === -1) return true;
    return usage.portfolios < limit;
  };

  return {
    user,
    plan,
    usage,
    canCreatePortfolio,
  };
};