// https://nuxt.com/docs/api/configuration/nuxt-config
import graphql from "@rollup/plugin-graphql";
export default defineNuxtConfig({
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config",
    exposeConfig: false,
    //config: {},
    injectPosition: 0,
    viewer: true,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "nuxt-icon",
    "@nuxt/image-edge",
    "nuxt-swiper",
    "nuxt-csurf",
    "magic-regexp/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/device",
    "@nuxtjs/html-validator",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  vite: {
    plugins: [graphql()],
  },
  build: {
    transpile: ["graphql", "@apollo/client", "@vue/apollo-composable"],
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "HibirLink Driver",

      meta: [
        {
          name: "description",
          content: "This site for the hibirlink driver page ",
        },
      ],
      link: [{ rel: "icon", href: "./delivery.png" }],
    },
  },
  ssr: false,
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },
  runtimeConfig: {
    firebaseApiKey: "",
    firebaseAuthDomain: "",
    firebaseProjectId: "",
    storagePacket: "",
    firebaseMessageSenderId: "",
    firebaseAppId: "",

    graphqlEndpoint: "",
    restEndpoint: "",

    public: {
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseProjectId: "",
      storagePacket: "",
      firebaseMessageSenderId: "",
      firebaseAppId: "",
      graphqlEndpoint: "",
      restEndpoint: "",
      hibirlinkEndPoint:""
    },
  },
});
