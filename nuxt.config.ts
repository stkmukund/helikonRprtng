// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    CC_LOGIN_ID: "revbdevdsg.helikon",
    CC_PASSWORRD: "yk5Z549ZN2KFz",
    // Keys within public are also exposed client-side
    public: {
      CC_LOGIN_ID: "revbdevdsg.helikon",
      CC_PASSWORRD: "yk5Z549ZN2KFz",
    },
  },

  modules: ["@nuxtjs/tailwindcss"],
});