import { useSearchParams } from "next/navigation";

export const useSearchQuery = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return query;
};
