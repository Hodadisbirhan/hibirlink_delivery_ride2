import { useSubscription } from "@vue/apollo-composable";
import { DocumentNode } from "graphql";
export default (query: DocumentNode, variable: any = null) => {
  const { onResult, onError, error, loading, document, restart, start, stop,result } =
    useSubscription(query, variable);

  return { onResult, onError, error, loading, document, restart, start, stop,result };
};
