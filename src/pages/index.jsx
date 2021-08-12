import * as React from "react"
import { graphql } from "gatsby"
import { Layout } from "../components/layout"
import IndexPageTwo from "../components/indexPageTwo"



export default function IndexPage({ data }) {
  return (
    <Layout>
      <IndexPageTwo />
    </Layout>
  )
}
