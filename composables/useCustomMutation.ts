import { useMutation } from "@vue/apollo-composable";
import { DocumentNode } from "graphql";
export default function useCustomMutation(mutation: DocumentNode) {
  const { mutate, onDone, onError } = useMutation(mutation);
  return { mutate, onDone, onError };
}
