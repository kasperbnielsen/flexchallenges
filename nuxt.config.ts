// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // @ts-ignore
  modules: ["@pinia/nuxt", "nuxt-og-image"],
  devtools: { enabled: true },
  runtimeConfig: {
    API_KEY: process.env.NUXT_API_KEY,
    REDIS_HOST: process.env.NUXT_REDIS_HOST,
    MONGODB_HOST: process.env.NUXT_MONGODB_HOST,
    public: { SERVER_HOST: process.env.NUXT_SERVER_HOST },
  },
  site: {
    url: "http://localhost:3000/",
  },
  app: {
    head: {
      meta: [
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://flexchallenges.lol/" },
        { property: "og:title", content: "FlexChallenges" },
        {
          property: "og:description",
          content:
            "Flexchallenges is a tool for any group of friends that enjoy playing flex queue together who are also looking for something new and challenging. With the release of challenges in 2022, you can as a group try to compete and win with team comps you wouldn’t normally play. By entering the names of your teammates, each player will receive a random champion that is included in a team that completes an achievement (if you win) - but don’t worry - we make sure that whoever is the best at the given champion gets assigned that champion. This is based entirely on mastery, so make sure to set your expectations at a reasonable level. THIS IS NOT EASY. Sometimes you might get champions that have a really hard time winning. Best of luck to any fucking gigachad gamers willing to try.",
        },
      ],
      link: [
        {
          href: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
          rel: "stylesheet",
          integrity:
            "sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC",
          crossorigin: "anonymous",
        },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap",
          rel: "stylesheet",
        },
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
          integrity:
            "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM",
          crossorigin: "anonymous",
        },
        {
          src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7345411778745982",
          crossorigin: "anonymous",
        },
      ],
    },
  },
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
});
