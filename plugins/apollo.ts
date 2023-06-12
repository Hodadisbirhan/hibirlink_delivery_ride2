import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client/core";
import { ApolloClients } from "@vue/apollo-composable";
import { useAuth } from "~~/store/auth";
import { storeToRefs } from "pinia";
import { setContext } from "@apollo/client/link/context";
import jwtDecode from "jwt-decode";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import { graphql } from "graphql";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const withToken = setContext(async (_, { headers }) => {
  const store = useAuth();
  const { token, uid } = storeToRefs(store);

  if (token.value) {
    const { exp } = jwtDecode(token.value) as {
      name: string;
      metadata: { roles: Array<string>; user_id: string };
      exp: number;
      iat: number;
    };

    // token Expired
    if (Date.now() >= exp * 1000 && process.client) {
      const config = useRuntimeConfig().public;
      await $fetch(config.restEndpoint + "/auth/refresh", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          uid: uid.value,
        }),
      })
        .then((value) => {
          const { accessToken } = value as { accessToken: string };

          store.setToken(accessToken);
        })
        .catch((err) => {
          // refresh token expires
          if (err.statusCode === 440) {
            store.setToken("");
            store.setUID("");
            const router = useRouter();
            router.push("/auth/rul");
          }
        });
    }
  }

  if (token.value)
    return {
      headers: {
        authorization: token ? `Bearer ${token.value}` : "",
      },
    };
});

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;
  console.log(config.graphqlEndpoint);

  const httpLink = createHttpLink({
    uri: config.graphqlEndpoint,
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: "ws://hibirlink.hasura.app/v1/graphql",
    })
  );

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  // const wsLink = new WebSocketLink({
  //   uri: `ws://localhost:3000`,
  //   options: {
  //     reconnect: true,
  //     lazy: true,
  //     timeout: 30000,
  //     inactivityTimeout: 30000,
  //   },
  // });

  // const link = split(
  //   // split based on operation type
  //   ({ query }) => {
  //     console.log(print(query));
  //     const definition = getMainDefinition(query);
  //     return (
  //       definition.kind === "OperationDefinition" &&
  //       definition.operation === "subscription"
  //     );
  //   },
  //   wsLink,
  //   httpLink
  // );

  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: withToken.concat(link),
    cache: new InMemoryCache(),
  });

  nuxtApp.vueApp.provide(ApolloClients, { default: apolloClient });
});
