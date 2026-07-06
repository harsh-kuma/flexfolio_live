
import { usePlan } from "@/hooks/usePlan";
import { useRouter } from "next/navigation";

export const usePortfolioGuard = () => {
  const router = useRouter();
  const { canCreatePortfolio , user , canAiGenerationAllowed } = usePlan();

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

  const checkAiGenerationAllowed = () => {
    if(!user){
      router.push("/auth/login");
      return false;
    }
    if (!canAiGenerationAllowed()) {
      router.push("/pricing");
      return false;
    }

    return true;
  };

  return { checkPortfolioAccess ,checkAiGenerationAllowed };
};