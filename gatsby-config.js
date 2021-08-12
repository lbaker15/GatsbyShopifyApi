require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    siteTitle: "gatsby-starter-shopify",
    siteTitleDefault: "gatsby-starter-shopify by @GatsbyJS",
    siteUrl: "https://shopify-demo.gatsbyjs.com",
    hrefLang: "en",
    siteDescription:
      "A Gatsby starter using the latest Shopify plugin showcasing a store with product overview, individual product pages, and a cart.",
    siteImage: "/default-og-image.jpg",
    twitter: "@gatsbyjs",
  },
  flags: {
    FAST_DEV: true,
  },
  plugins: [
    `glsl-canvas-js`,
    `gsap`,
    {
      resolve: "gatsby-source-shopify",
      options: {
        password: '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',
        storeUrl: 'naturdo.myshopify.com',
        accessToken: 'f260cfece506236b22fffa47c4172d51',
        shopifyConnections: ["collections", "orders"],
        fetchCollections: [`ARTICLES`, `BLOGS`, `PRODUCTS`]
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-gatsby-cloud",
    // Add your Google Analytics ID to the .env file to enable
    // Otherwise, this plugin can be removed
    // process.env.GOOGLE_ANALYTICS_ID && {
    //   resolve: "gatsby-plugin-google-analytics",
    //   options: {
    //     trackingId: process.env.GOOGLE_ANALYTICS_ID,
    //   },
    // },
  ].filter(Boolean),
}
