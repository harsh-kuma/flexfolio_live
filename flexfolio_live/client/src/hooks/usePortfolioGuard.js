
import { usePlan } from "@/hooks/usePlan";
import { useRouter } from "next/navigation";

export const usePortfolioGuard = () => {
  const router = useRouter();
  const { canCreatePortfolio , user } = usePlan();

  const checkPortfolioAccess = () => {
    if(!user){
      router.push("/auth/login");
      return false;
    }
    if (!canCreatePortfolio()) {
      router.push("/pricing");
      return false;
    }

    return true;
  };

  return { checkPortfolioAccess };
};