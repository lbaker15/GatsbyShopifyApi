import React, {useEffect, useState} from 'react';
import { graphql } from "gatsby";
import { Layout } from "../components/layout";
import Cart from "./cart";
import Popular from "../components/popular";
import cartImg from "../images/shopping-cart.png";
import './index.css';

export default function IndexPage({ data }) {
  const [open, setOpen] = useState(false)
  return (
    <Layout>
      <div className="header">
        <button 
        className="cartBtn"
        onClick={() => setOpen(!open)}
        >
          <img src={cartImg} />
        </button>
        {open && <Cart />}
      </div>
      <Popular data={data} />
    </Layout>
  )
}

export const query = graphql`
  {
    allShopifyProduct(sort: { fields: [title] }) {
      edges {
        node {
          id
          title
          shopifyId
          status
          description
          handle
          onlineStoreUrl
          totalInventory
          vendor
          featuredImage {
            gatsbyImageData(width: 910, height: 910)
          }
          priceRangeV2 {
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
          variants {
            id
            shopifyId
            storefrontId
          }
        }
      }
    }
  }
`