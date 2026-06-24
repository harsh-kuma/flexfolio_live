
import { usePlan } from "@/hooks/usePlan";
import { useRouter } from "next/navigation";

export const usePortfolioGuard = () => {
  const router = useRouter();
  const { canCreatePortfolio } = usePlan();

  const checkPortfolioAccess = () => {
    if (!canCreatePortfolio()) {
      router.push("/pricing");
      return false;
    }

    return true;
  };

  return { checkPortfolioAccess };
};