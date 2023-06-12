import { useQuery } from "@vue/apollo-composable";
import { DocumentNode } from "graphql";
export default function useCustomQuery(
  query: DocumentNode,
  variable: any = null,
  debounce: number = 0,
  enabled: any = ref(true)
) {
  const { error, fetchMore, result, loading, onResult, onError, refetch } =
    useQuery(query, variable, () => ({
      debounce: debounce,
      fetchPolicy: "no-cache",
      enabled: enabled.value,
    }));
  return {
    error,
    fetchMore,
    result,
    loading,
    onResult,
    onError,
    refetch,
  };
}
