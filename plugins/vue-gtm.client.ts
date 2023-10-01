import { createGtm } from "@gtm-support/vue-gtm";

export default defineNuxtPlugin((nuxtApp) => {
  if (useRuntimeConfig().public.appEnv !== "production") return;
  nuxtApp.vueApp.use(
    createGtm({
      id: "G-EDXB2M8TJ2",
      defer: false,
      compatibility: false,
      enabled: true,
      debug: true,
      loadScript: true,
      vueRouter: useRouter(),
      trackOnNextTick: false,
    })
  );
});
