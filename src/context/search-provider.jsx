import * as React from "react"
import { createClient, Provider as UrlqProvider } from "urql"

console.log('PROCESS', process.env)
const urqlClient = createClient({
  url: `https://naturdo.myshopify.com/api/2021-01/graphql.json`,
  fetchOptions: {
    headers: {
      "X-Shopify-Storefront-Access-Token":
        'f260cfece506236b22fffa47c4172d51',
    },
  },
})

export function SearchProvider({ children }) {
  return <UrlqProvider value={urqlClient}>{children}</UrlqProvider>
}
